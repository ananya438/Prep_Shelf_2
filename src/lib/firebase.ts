import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  getDocs,
  orderBy,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import type { Resource, ResourceType } from '../types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isFirebaseConfigured =
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.apiKey !== 'demo';

let app: ReturnType<typeof initializeApp>;
let db: ReturnType<typeof getFirestore>;
let storage: ReturnType<typeof getStorage>;
let auth: ReturnType<typeof getAuth>;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);
} else {
  app = initializeApp({
    apiKey: 'demo',
    authDomain: 'demo',
    projectId: 'demo',
    storageBucket: 'demo',
    messagingSenderId: 'demo',
    appId: 'demo',
  });
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);
}

const RESOURCES_COLLECTION = 'resources';

function getMockResources(type: ResourceType): Resource[] {
  return [
    {
      id: '1',
      title: 'Sample PYQ 2023',
      degree: 'B.Tech',
      branch: 'CSE',
      semester: 3,
      subject: 'Data Structures',
      resourceType: type,
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: 'sample.pdf',
      approved: true,
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Introduction to Algorithms Notes',
      degree: 'B.Tech',
      branch: 'CSE',
      semester: 4,
      subject: 'Algorithms',
      resourceType: type,
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: 'algorithms-notes.pdf',
      approved: true,
      createdAt: new Date(),
    },
  ];
}

export function getApprovedResources(
  resourceType: ResourceType,
  callback: (data: Resource[]) => void
) {
  if (!isFirebaseConfigured) {
    callback(getMockResources(resourceType));
    return () => {};
  }

  const q = query(
    collection(db, RESOURCES_COLLECTION),
    where('resourceType', '==', resourceType),
    where('approved', '==', true),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const data: Resource[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          title: d.title || '',
          degree: d.degree || '',
          branch: d.branch || '',
          semester: d.semester || 1,
          subject: d.subject || '',
          resourceType: d.resourceType,
          pdfUrl: d.pdfUrl || '',
          fileName: d.fileName || '',
          approved: d.approved ?? false,
          createdAt: d.createdAt?.toDate?.() || new Date(),
        } as Resource;
      });
      callback(data);
    },
    (err) => {
      console.warn('Firebase error:', err?.message);
      callback(getMockResources(resourceType));
    }
  );
}

export async function submitResource(data: {
  degree: string;
  branch: string;
  semester: number;
  subject: string;
  resourceType: ResourceType;
  file: File;
  submittedByName?: string;
}) {
  let pdfUrl = '';
  if (isFirebaseConfigured && firebaseConfig.storageBucket) {
    const storageRef = ref(storage, `uploads/${Date.now()}_${data.file.name}`);
    await uploadBytes(storageRef, data.file);
    pdfUrl = await getDownloadURL(storageRef);
  } else {
    pdfUrl = URL.createObjectURL(data.file);
  }

  if (!isFirebaseConfigured) {
    console.log('Firebase not configured. Mock submission:', { ...data, pdfUrl });
    throw new Error('Firebase is not configured. Add env variables to enable submissions.');
  }

  await addDoc(collection(db, RESOURCES_COLLECTION), {
    title: data.file.name.replace(/\.pdf$/i, ''),
    degree: data.degree,
    branch: data.branch,
    semester: data.semester,
    subject: data.subject,
    resourceType: data.resourceType,
    pdfUrl,
    fileName: data.file.name,
    submittedBy: data.submittedByName || null,
    approved: false,
    createdAt: new Date(),
  });
}

export async function getPendingResources(): Promise<Resource[]> {
  if (!isFirebaseConfigured) {
    return [];
  }
  const q = query(
    collection(db, RESOURCES_COLLECTION),
    where('approved', '==', false)
  );
  const snap = await getDocs(q);
  return snap.docs.map((docSnap) => {
    const d = docSnap.data();
    return {
      id: docSnap.id,
      title: d.title || '',
      degree: d.degree || '',
      branch: d.branch || '',
      semester: d.semester || 1,
      subject: d.subject || '',
      resourceType: d.resourceType,
      pdfUrl: d.pdfUrl || '',
      fileName: d.fileName || '',
      submittedBy: d.submittedBy,
      approved: d.approved ?? false,
      createdAt: d.createdAt?.toDate?.() || new Date(),
    } as Resource;
  });
}

export { auth, signInWithEmailAndPassword };
