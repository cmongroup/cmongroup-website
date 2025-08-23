"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getFirestore,
  doc,
  onSnapshot,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import app from "@/lib/firebase";

interface CompanyContent {
  tagline: string;
  description: string;
  section1: {
    title: string;
    summary: string;
    services: string;
  };
  section2: {
    title: string;
    description: string;
    expertisePoints: string[];
  };
  section3: {
    title: string;
    description: string;
    benefits: string[];
  };
  cta: {
    heading: string;
    description: string;
  };
}

interface CompanyImages {
  coverSrc: string;
  coverAlt: string;
  section1Src: string;
  section1Alt: string;
  section2Src: string;
  section2Alt: string;
  section3Src: string;
  section3Alt: string;
}

// New interfaces for companies page
interface CompaniesPageContent {
  header: {
    badge: string;
    title: string;
    description: string;
  };
  companies: {
    [key: string]: {
      tagline: string;
      brandName: string;
      summary: string;
      services: string[];
      servicesLabel: string;
    };
  };
  cta: {
    title: string;
    description: string;
    primaryButton: {
      title: string;
      route: string;
    };
    secondaryButton: {
      title: string;
      route: string;
    };
  };
}

interface CompaniesPageImages {
  [key: string]: {
    coverSrc: string;
    coverAlt: string;
  };
}

interface ContentContextType {
  companyContent: Record<string, CompanyContent> | null;
  companyImages: Record<string, CompanyImages> | null;
  companiesPageContent: CompaniesPageContent | null;
  companiesPageImages: CompaniesPageImages | null;
  isLoading: boolean;
  updateCompanyText: (
    companySlug: string,
    path: string,
    value: string | string[]
  ) => Promise<void>;
  updateCompanyImage: (
    companySlug: string,
    path: string,
    value: string
  ) => Promise<void>;
  updateCompaniesPageText: (
    path: string,
    value: string | string[]
  ) => Promise<void>;
  updateCompaniesPageImage: (
    companySlug: string,
    path: string,
    value: string
  ) => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [companyContent, setCompanyContent] = useState<Record<
    string,
    CompanyContent
  > | null>(null);
  const [companyImages, setCompanyImages] = useState<Record<
    string,
    CompanyImages
  > | null>(null);
  const [companiesPageContent, setCompaniesPageContent] =
    useState<CompaniesPageContent | null>(null);
  const [companiesPageImages, setCompaniesPageImages] =
    useState<CompaniesPageImages | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const db = getFirestore(app);

    // Function to fetch all company data
    const fetchCompanyData = async () => {
      try {
        const [
          contentSnapshot,
          imagesSnapshot,
          companiesPageContentSnapshot,
          companiesPageImagesSnapshot,
        ] = await Promise.all([
          getDocs(collection(db, "companyContent")),
          getDocs(collection(db, "companyImages")),
          getDocs(collection(db, "companiesPageContent")),
          getDocs(collection(db, "companiesPageImages")),
        ]);

        const content: Record<string, CompanyContent> = {};
        const images: Record<string, CompanyImages> = {};

        contentSnapshot.forEach((doc) => {
          content[doc.id] = doc.data() as CompanyContent;
        });

        imagesSnapshot.forEach((doc) => {
          images[doc.id] = doc.data() as CompanyImages;
        });

        // Get companies page content (should only be one document)
        let companiesPageContentData: CompaniesPageContent | null = null;
        companiesPageContentSnapshot.forEach((doc) => {
          companiesPageContentData = doc.data() as CompaniesPageContent;
        });

        // Get companies page images (should only be one document)
        let companiesPageImagesData: CompaniesPageImages | null = null;
        companiesPageImagesSnapshot.forEach((doc) => {
          companiesPageImagesData = doc.data() as CompaniesPageImages;
        });

        setCompanyContent(content);
        setCompanyImages(images);
        setCompaniesPageContent(companiesPageContentData);
        setCompaniesPageImages(companiesPageImagesData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching company data:", error);
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchCompanyData();

    // Listen to changes on one company to trigger updates
    const unsubscribeContent = onSnapshot(
      doc(db, "companyContent", "gmep"),
      () => {
        // Refetch all data when any company changes
        fetchCompanyData();
      },
      (error) => {
        console.error("Error listening to content changes:", error);
      }
    );

    // Listen to changes on companies page content
    const unsubscribeCompaniesPage = onSnapshot(
      doc(db, "companiesPageContent", "main"),
      () => {
        // Refetch all data when companies page changes
        fetchCompanyData();
      },
      (error) => {
        console.error("Error listening to companies page changes:", error);
      }
    );

    return () => {
      unsubscribeContent();
      unsubscribeCompaniesPage();
    };
  }, []);

  const updateCompanyText = async (
    companySlug: string,
    path: string,
    value: string | string[]
  ) => {
    try {
      const db = getFirestore(app);
      const companyRef = doc(db, "companyContent", companySlug);

      // Handle nested path updates
      const pathParts = path.split(".");
      const updateData: any = {};
      let current = updateData;

      for (let i = 0; i < pathParts.length - 1; i++) {
        current[pathParts[i]] = {};
        current = current[pathParts[i]];
      }
      current[pathParts[pathParts.length - 1]] = value;

      await updateDoc(companyRef, updateData);
    } catch (error) {
      console.error("Error updating company text:", error);
      throw error;
    }
  };

  const updateCompanyImage = async (
    companySlug: string,
    path: string,
    value: string
  ) => {
    try {
      const db = getFirestore(app);
      const companyRef = doc(db, "companyImages", companySlug);

      // Simple update for flattened structure
      const updateData = { [path]: value };
      await updateDoc(companyRef, updateData);
    } catch (error) {
      console.error("Error updating company image:", error);
      throw error;
    }
  };

  const updateCompaniesPageText = async (
    path: string,
    value: string | string[]
  ) => {
    try {
      const db = getFirestore(app);
      const companiesPageRef = doc(db, "companiesPageContent", "main");

      // Handle nested path updates
      const pathParts = path.split(".");
      const updateData: any = {};
      let current = updateData;

      for (let i = 0; i < pathParts.length - 1; i++) {
        current[pathParts[i]] = {};
        current = current[pathParts[i]];
      }
      current[pathParts[pathParts.length - 1]] = value;

      await updateDoc(companiesPageRef, updateData);
    } catch (error) {
      console.error("Error updating companies page text:", error);
      throw error;
    }
  };

  const updateCompaniesPageImage = async (
    companySlug: string,
    path: string,
    value: string
  ) => {
    try {
      const db = getFirestore(app);
      const companiesPageRef = doc(db, "companiesPageImages", "main");

      // Update the specific company's image
      const updateData = { [companySlug]: { [path]: value } };
      await updateDoc(companiesPageRef, updateData);
    } catch (error) {
      console.error("Error updating companies page image:", error);
      throw error;
    }
  };

  return (
    <ContentContext.Provider
      value={{
        companyContent,
        companyImages,
        companiesPageContent,
        companiesPageImages,
        isLoading,
        updateCompanyText,
        updateCompanyImage,
        updateCompaniesPageText,
        updateCompaniesPageImage,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}
