import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { CompanyConfig, CompanyConfigWithId } from "@/types/company-config";

const CONFIG_COLLECTION = "configurations";

/**
 * Fetches the company configuration from Firestore by document ID.
 * Returns default values if no configuration exists.
 */
export async function getCompanyConfig(docId: string): Promise<CompanyConfig> {
  const docRef = doc(db, CONFIG_COLLECTION, docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      logoUrl: data.logoUrl || "",
      companyDescription: data.companyDescription || "",
      keywords: Array.isArray(data.keywords) ? data.keywords : [],
      googleMapsUrl: data.googleMapsUrl || "",
    };
  } else {
    console.log(`No document found with ID "${docId}". Returning default config.`);
    return {
      logoUrl: "",
      companyDescription: "Our awesome company!",
      keywords: ["service", "quality", "friendly"],
      googleMapsUrl: "",
    };
  }
}

/**
 * Saves or creates a company configuration in Firestore.
 * If `docId` is provided, it updates the existing document.
 * If `docId` is not provided, it creates a new document.
 */
export async function saveCompanyConfig(config: CompanyConfig, docId?: string): Promise<string> {
  try {
    if (docId) {
      const docRef = doc(db, CONFIG_COLLECTION, docId);
      await setDoc(docRef, {
        ...config,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      console.log(`Configuration updated for document ID: ${docId}`);
      return docId;
    } else {
      const newDocRef = await addDoc(collection(db, CONFIG_COLLECTION), {
        ...config,
        createdAt: serverTimestamp(),
      });
      console.log(`New configuration document created with ID: ${newDocRef.id}`);
      return newDocRef.id;
    }
  } catch (error) {
    console.error("Error saving company configuration:", error);
    throw new Error("Failed to save configuration.");
  }
}

export async function getAllCompanyConfigs(): Promise<CompanyConfigWithId[]> {
  const snapshot = await getDocs(collection(db, CONFIG_COLLECTION));
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      logoUrl: data.logoUrl || "",
      companyDescription: data.companyDescription || "",
      keywords: Array.isArray(data.keywords) ? data.keywords : [],
      googleMapsUrl: data.googleMapsUrl || "",
    };
  });
}

export async function deleteCompanyConfig(docId: string): Promise<void> {
  const docRef = doc(db, CONFIG_COLLECTION, docId);
  await deleteDoc(docRef);
  console.log(`Configuration with ID "${docId}" has been deleted.`);
}