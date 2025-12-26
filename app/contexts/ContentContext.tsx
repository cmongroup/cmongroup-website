"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getFirestore,
  doc,
  onSnapshot,
  collection,
  getDocs,
  updateDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import app from "@/lib/firebase";

interface CompanyContent {
  brandName: string;
  tagline: string;
  description: string;
  section1: {
    title: string;
    summary: string;
    description: string;
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
  section1Images: string[];
  section1Alts: string[];
  section2Images: string[];
  section2Alts: string[];
  section3Images: string[];
  section3Alts: string[];
  section4Images: string[];
  section4Alts: string[];
  section5Images: string[];
  section5Alts: string[];
  // Legacy support for old structure
  section1Src?: string;
  section1Alt?: string;
  section2Src?: string;
  section2Alt?: string;
  section3Src?: string;
  section3Alt?: string;
  section4Src?: string;
  section4Alt?: string;
  section5Src?: string;
  section5Alt?: string;
}

interface FooterContent {
  columns: [
    {
      title: string;
      items: [
        {
          type: "text" | "link";
          value?: string;
          label?: string;
          route?: string;
        },
      ];
    },
    {
      title: string;
      items: [
        {
          type: "text" | "link";
          value?: string;
          label?: string;
          route?: string;
        },
      ];
    },
    {
      title: string;
      items: [
        {
          type: "text" | "link";
          value?: string;
          label?: string;
          route?: string;
        },
      ];
    },
  ];
  bottom: {
    legal: string;
  };
}

interface ContentContextType {
  companyContent: Record<string, CompanyContent> | null;
  companyImages: Record<string, CompanyImages> | null;
  websiteContent: any | null;
  websiteImages: any | null;
  footerContent: FooterContent | null;
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
  updateCompanySectionImages: (
    companySlug: string,
    sectionNumber: number,
    images: string[],
    alts: string[]
  ) => Promise<void>;
  updateWebsiteText: (path: string, value: string | string[]) => Promise<void>;
  updateWebsiteImage: (path: string, value: string) => Promise<void>;
  updateFooterText: (path: string, value: string) => Promise<void>;
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
  const [footerContent, setFooterContent] = useState<FooterContent | null>(
    null
  );

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
          footerContentSnapshot,
        ] = await Promise.all([
          getDocs(collection(db, "companyContent")),
          getDocs(collection(db, "companyImages")),
          getDocs(collection(db, "websiteContent")),
          getDocs(collection(db, "websiteImages")),
          getDocs(collection(db, "footerContent")),
        ]);

        const companyContent: Record<string, CompanyContent> = {};
        const companyImages: Record<string, CompanyImages> = {};
        const fragments: Record<string, any> = {};

        companyContentSnapshot.forEach((doc) => {
          companyContent[doc.id] = doc.data() as CompanyContent;
        });

        companyImagesSnapshot.forEach((doc) => {
          const data = doc.data() as CompanyImages;
          // Check for section fragments (e.g., "slug_section1")
          const match = doc.id.match(/(.+)_section(\d+)$/);

          if (match) {
            const baseSlug = match[1];
            if (!fragments[baseSlug]) fragments[baseSlug] = {};
            // Merge fragment data
            fragments[baseSlug] = { ...fragments[baseSlug], ...data };
          } else {
            // Main document
            companyImages[doc.id] = data;
          }
        });

        // Merge fragments into main company images
        Object.keys(fragments).forEach((slug) => {
          if (companyImages[slug]) {
            companyImages[slug] = {
              ...companyImages[slug],
              ...fragments[slug],
            };
          } else {
            // Even if main doc doesn't exist, allow fragment data
            companyImages[slug] = fragments[slug] as CompanyImages;
          }
        });

        // Get website content and images
        const websiteContent = websiteContentSnapshot.docs[0]?.data() || null;
        const websiteImages = websiteImagesSnapshot.docs[0]?.data() || null;
        const footerContent =
          (footerContentSnapshot.docs[0]?.data() as FooterContent | null) ||
          null;

        setCompanyContent(companyContent);
        setCompanyImages(companyImages);
        setWebsiteContent(websiteContent);
        setWebsiteImages(websiteImages);
        setFooterContent(footerContent);
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

    const unsubscribeFooterContent = onSnapshot(
      collection(db, "footerContent"),
      () => {
        // Refetch all data when footer content changes
        fetchAllData();
      },
      (error) => {
        console.error("Error listening to footer content changes:", error);
      }
    );

    return () => {
      unsubscribeCompanyContent();
      unsubscribeCompanyImages();
      unsubscribeWebsiteContent();
      unsubscribeWebsiteImages();
      unsubscribeFooterContent();
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

  const updateCompanySectionImages = async (
    companySlug: string,
    sectionNumber: number,
    images: string[],
    alts: string[]
  ) => {
    try {
      const db = getFirestore(app);
      // Use a separate document for each section to avoid 1MB limit
      // Format: {slug}_section{N}
      const fragmentId = `${companySlug}_section${sectionNumber}`;
      const fragmentRef = doc(db, "companyImages", fragmentId);

      // Update both images and alts arrays for the section
      const updateData = {
        [`section${sectionNumber}Images`]: images,
        [`section${sectionNumber}Alts`]: alts,
      };

      // Use setDoc with merge: true to create if not exists
      await setDoc(fragmentRef, updateData, { merge: true });
    } catch (error) {
      console.error("Error updating company section images:", error);
      throw error;
    }
  };

  const updateFooterText = async (path: string, value: string) => {
    try {
      const db = getFirestore(app);
      const footerRef = doc(db, "footerContent", "main");

      // Get current footer content first
      const currentDoc = await getDoc(footerRef);
      if (!currentDoc.exists()) {
        throw new Error("Footer content document does not exist");
      }

      const currentData = currentDoc.data() as FooterContent;

      // Create a deep copy to avoid mutating the original
      const updatedData = JSON.parse(JSON.stringify(currentData));

      // Update the nested path manually with proper array handling
      const pathParts = path.split(".");
      let current: any = updatedData;

      // Navigate to the parent of the target property
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        const isArrayIndex = !isNaN(Number(part));

        if (current && typeof current === "object") {
          if (Array.isArray(current) && isArrayIndex) {
            const index = Number(part);
            if (index >= 0 && index < current.length) {
              current = current[index];
            } else {
              throw new Error(
                `Array index out of bounds: ${index} in path ${path}`
              );
            }
          } else if (!Array.isArray(current) && part in current) {
            current = current[part];
          } else {
            throw new Error(`Invalid path segment: ${part} in path ${path}`);
          }
        } else {
          throw new Error(`Invalid path: ${path}`);
        }
      }

      // Update the target property
      const lastPart = pathParts[pathParts.length - 1];
      const isLastArrayIndex = !isNaN(Number(lastPart));

      if (current && typeof current === "object") {
        if (Array.isArray(current) && isLastArrayIndex) {
          const index = Number(lastPart);
          if (index >= 0 && index < current.length) {
            current[index] = value;
          } else {
            throw new Error(
              `Array index out of bounds: ${index} in path ${path}`
            );
          }
        } else if (!Array.isArray(current) && lastPart in current) {
          current[lastPart] = value;
        } else {
          throw new Error(
            `Invalid final path segment: ${lastPart} in path ${path}`
          );
        }
      } else {
        throw new Error(`Cannot update path: ${path}`);
      }

      // Save the entire updated document (overwrite to preserve array structure)
      await setDoc(footerRef, updatedData);

      console.log(`✅ Successfully updated footer path: ${path} = ${value}`);
    } catch (error) {
      console.error("Error updating footer text:", error);
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
        footerContent,
        isLoading,
        updateCompanyText,
        updateCompanyImage,
        updateCompanySectionImages,
        updateWebsiteText,
        updateWebsiteImage,
        updateFooterText,
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
