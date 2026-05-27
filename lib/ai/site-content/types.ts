export type SiteContentPage = {
  id: string;
  title: string;
  section: string;
  body: string;
};

export type SiteContentSnapshot = {
  fingerprint: string;
  syncedAt: string;
  pageCount: number;
  pages: SiteContentPage[];
  formatted: string;
};

export type SiteContentFingerprintSource = {
  homepageUpdatedAt: string | null;
  settingsUpdatedAt: string | null;
  serviceRevisions: Array<{ id: string; updated_at: string }>;
  galleryCount: number;
  reviewCount: number;
  knowledgeCount: number;
  staticRevision: string;
};
