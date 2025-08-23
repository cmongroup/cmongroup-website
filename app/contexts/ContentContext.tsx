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
  section4: {
    title: string;
    description: string;
    features: string[];
  };
  section5: {
    title: string;
    description: string;
    highlights: string[];
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
  section4Src: string;
  section4Alt: string;
  section5Src: string;
  section5Alt: string;
}

interface ContentContextType {
  companyContent: Record<string, CompanyContent> | null;
  companyImages: Record<string, CompanyImages> | null;
  websiteContent: any | null;
  websiteImages: any | null;
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
  updateWebsiteText: (path: string, value: string | string[]) => Promise<void>;
  updateWebsiteImage: (path: string, value: string) => Promise<void>;
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
  const [websiteContent, setWebsiteContent] = useState<any | null>(null);
  const [websiteImages, setWebsiteImages] = useState<any | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const db = getFirestore(app);

    // Function to fetch all data
    const fetchAllData = async () => {
      try {
        const [
          companyContentSnapshot,
          companyImagesSnapshot,
          websiteContentSnapshot,
          websiteImagesSnapshot,
        ] = await Promise.all([
          getDocs(collection(db, "companyContent")),
          getDocs(collection(db, "companyImages")),
          getDocs(collection(db, "websiteContent")),
          getDocs(collection(db, "websiteImages")),
        ]);

        const companyContent: Record<string, CompanyContent> = {};
        const companyImages: Record<string, CompanyImages> = {};

        companyContentSnapshot.forEach((doc) => {
          companyContent[doc.id] = doc.data() as CompanyContent;
        });

        companyImagesSnapshot.forEach((doc) => {
          companyImages[doc.id] = doc.data() as CompanyImages;
        });

        // Get website content and images
        const websiteContent = websiteContentSnapshot.docs[0]?.data() || null;
        const websiteImages = websiteImagesSnapshot.docs[0]?.data() || null;

        setCompanyContent(companyContent);
        setCompanyImages(companyImages);
        setWebsiteContent(websiteContent);
        setWebsiteImages(websiteImages);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchAllData();

    // Listen to changes on all collections to trigger updates
    const unsubscribeCompanyContent = onSnapshot(
      collection(db, "companyContent"),
      () => {
        // Refetch all data when any company changes
        fetchAllData();
      },
      (error) => {
        console.error("Error listening to company content changes:", error);
      }
    );

    const unsubscribeCompanyImages = onSnapshot(
      collection(db, "companyImages"),
      () => {
        // Refetch all data when any company images change
        fetchAllData();
      },
      (error) => {
        console.error("Error listening to company image changes:", error);
      }
    );

    const unsubscribeWebsiteContent = onSnapshot(
      collection(db, "websiteContent"),
      () => {
        // Refetch all data when website content changes
        fetchAllData();
      },
      (error) => {
        console.error("Error listening to website content changes:", error);
      }
    );

    const unsubscribeWebsiteImages = onSnapshot(
      collection(db, "websiteImages"),
      () => {
        // Refetch all data when website images change
        fetchAllData();
      },
      (error) => {
        console.error("Error listening to website image changes:", error);
      }
    );

    return () => {
      unsubscribeCompanyContent();
      unsubscribeCompanyImages();
      unsubscribeWebsiteContent();
      unsubscribeWebsiteImages();
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

      // Use dot notation for nested updates
      const updateData = { [path]: value };
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

  const updateWebsiteText = async (path: string, value: string | string[]) => {
    try {
      const db = getFirestore(app);
      const websiteRef = doc(db, "websiteContent", "main");

      // Use dot notation for nested updates
      const updateData = { [path]: value };
      await updateDoc(websiteRef, updateData);
    } catch (error) {
      console.error("Error updating website text:", error);
      throw error;
    }
  };

  const updateWebsiteImage = async (path: string, value: string) => {
    try {
      const db = getFirestore(app);
      const websiteRef = doc(db, "websiteImages", "main");

      // Simple update for flattened structure
      const updateData = { [path]: value };
      await updateDoc(websiteRef, updateData);
    } catch (error) {
      console.error("Error updating website image:", error);
      throw error;
    }
  };

  return (
    <ContentContext.Provider
      value={{
        companyContent,
        companyImages,
        websiteContent,
        websiteImages,
        isLoading,
        updateCompanyText,
        updateCompanyImage,
        updateWebsiteText,
        updateWebsiteImage,
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
