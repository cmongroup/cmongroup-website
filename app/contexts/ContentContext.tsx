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
  brandName: string;
  tagline: string;
  description: string;
  section1: {
    title: string;
    summary: string;
    services: string;
    servicesLabel: string;
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



interface ContentContextType {
  companyContent: Record<string, CompanyContent> | null;
  companyImages: Record<string, CompanyImages> | null;
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

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const db = getFirestore(app);

    // Function to fetch all company data
    const fetchCompanyData = async () => {
      try {
        const [
          contentSnapshot,
          imagesSnapshot,
        ] = await Promise.all([
          getDocs(collection(db, "companyContent")),
          getDocs(collection(db, "companyImages")),
        ]);

        const content: Record<string, CompanyContent> = {};
        const images: Record<string, CompanyImages> = {};

        contentSnapshot.forEach((doc) => {
          content[doc.id] = doc.data() as CompanyContent;
        });

        imagesSnapshot.forEach((doc) => {
          images[doc.id] = doc.data() as CompanyImages;
        });

        setCompanyContent(content);
        setCompanyImages(images);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching company data:", error);
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchCompanyData();

    // Listen to changes on all companies to trigger updates
    const unsubscribeContent = onSnapshot(
      collection(db, "companyContent"),
      () => {
        // Refetch all data when any company changes
        fetchCompanyData();
      },
      (error) => {
        console.error("Error listening to content changes:", error);
      }
    );

    const unsubscribeImages = onSnapshot(
      collection(db, "companyImages"),
      () => {
        // Refetch all data when any company images change
        fetchCompanyData();
      },
      (error) => {
        console.error("Error listening to image changes:", error);
      }
    );

    return () => {
      unsubscribeContent();
      unsubscribeImages();
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



  return (
    <ContentContext.Provider
      value={{
        companyContent,
        companyImages,
        isLoading,
        updateCompanyText,
        updateCompanyImage,
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
