-- CreateTable
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "User_clerkUserId_key" ON "User"("clerkUserId");
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- CreateTable
CREATE TABLE IF NOT EXISTS "Organization" (
    "id" TEXT NOT NULL,
    "clerkOrgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "planId" TEXT NOT NULL DEFAULT 'trial',
    "planStatus" TEXT NOT NULL DEFAULT 'trialing',
    "trialEndsAt" TIMESTAMP(3),
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "quotaPagesPerMonth" INTEGER NOT NULL DEFAULT 500,
    "quotaPdfsPerMonth" INTEGER NOT NULL DEFAULT 50,
    "quotaSitesMax" INTEGER NOT NULL DEFAULT 3,
    "quotaSeatsMax" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Organization_clerkOrgId_key" ON "Organization"("clerkOrgId");
CREATE UNIQUE INDEX IF NOT EXISTS "Organization_slug_key" ON "Organization"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "Organization_stripeCustomerId_key" ON "Organization"("stripeCustomerId");
CREATE UNIQUE INDEX IF NOT EXISTS "Organization_stripeSubscriptionId_key" ON "Organization"("stripeSubscriptionId");

-- CreateTable
CREATE TABLE IF NOT EXISTS "Membership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Membership_userId_organizationId_key" ON "Membership"("userId", "organizationId");
CREATE INDEX IF NOT EXISTS "Membership_organizationId_idx" ON "Membership"("organizationId");

-- CreateTable
CREATE TABLE IF NOT EXISTS "Site" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "cmsType" TEXT,
    "lastScanAt" TIMESTAMP(3),
    "lastScore" INTEGER,
    "openIssues" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Site_organizationId_idx" ON "Site"("organizationId");

-- CreateTable
CREATE TABLE IF NOT EXISTS "Document" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "storageKey" TEXT NOT NULL,
    "fileHash" TEXT NOT NULL,
    "scanStatus" TEXT NOT NULL DEFAULT 'pending',
    "lastScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Document_organizationId_idx" ON "Document"("organizationId");

-- CreateTable
CREATE TABLE IF NOT EXISTS "Scan" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "siteId" TEXT,
    "documentId" TEXT,
    "url" TEXT,
    "scanType" TEXT NOT NULL DEFAULT 'page',
    "status" TEXT NOT NULL DEFAULT 'queued',
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "pagesScanned" INTEGER NOT NULL DEFAULT 0,
    "totalIssues" INTEGER NOT NULL DEFAULT 0,
    "criticalCount" INTEGER NOT NULL DEFAULT 0,
    "highCount" INTEGER NOT NULL DEFAULT 0,
    "mediumCount" INTEGER NOT NULL DEFAULT 0,
    "lowCount" INTEGER NOT NULL DEFAULT 0,
    "autoFixCount" INTEGER NOT NULL DEFAULT 0,
    "aiSuggestedCount" INTEGER NOT NULL DEFAULT 0,
    "codePatchCount" INTEGER NOT NULL DEFAULT 0,
    "humanReviewCount" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER,
    "triggeredByUserId" TEXT,
    "triggerSource" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Scan_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Scan_organizationId_createdAt_idx" ON "Scan"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "Scan_siteId_idx" ON "Scan"("siteId");
CREATE INDEX IF NOT EXISTS "Scan_status_idx" ON "Scan"("status");

-- CreateTable
CREATE TABLE IF NOT EXISTS "Issue" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "wcag" TEXT[],
    "severity" TEXT NOT NULL,
    "repairType" TEXT NOT NULL,
    "confidence" TEXT NOT NULL,
    "selectors" TEXT[],
    "htmlSnippet" TEXT NOT NULL,
    "helpUrl" TEXT NOT NULL,
    "patternHash" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "resolvedAt" TIMESTAMP(3),
    "resolvedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Issue_scanId_idx" ON "Issue"("scanId");
CREATE INDEX IF NOT EXISTS "Issue_organizationId_status_idx" ON "Issue"("organizationId", "status");

-- CreateTable
CREATE TABLE IF NOT EXISTS "Fix" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "suggestedValue" TEXT,
    "codePatch" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "editedValue" TEXT,
    "approvedByUserId" TEXT,
    "approvedAt" TIMESTAMP(3),
    "generatedByModel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Fix_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Fix_issueId_key" ON "Fix"("issueId");
CREATE INDEX IF NOT EXISTS "Fix_organizationId_status_idx" ON "Fix"("organizationId", "status");

-- CreateTable
CREATE TABLE IF NOT EXISTS "AuditEvent" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "resourceType" TEXT,
    "resourceId" TEXT,
    "metadata" JSONB,
    "requestId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "AuditEvent_organizationId_createdAt_idx" ON "AuditEvent"("organizationId", "createdAt");

-- CreateTable
CREATE TABLE IF NOT EXISTS "UsageRecord" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "periodDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UsageRecord_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "UsageRecord_organizationId_metric_periodDate_key" ON "UsageRecord"("organizationId", "metric", "periodDate");

-- AddForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT IF EXISTS "Membership_userId_fkey";
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Membership" DROP CONSTRAINT IF EXISTS "Membership_organizationId_fkey";
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Site" DROP CONSTRAINT IF EXISTS "Site_organizationId_fkey";
ALTER TABLE "Site" ADD CONSTRAINT "Site_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Document" DROP CONSTRAINT IF EXISTS "Document_organizationId_fkey";
ALTER TABLE "Document" ADD CONSTRAINT "Document_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Scan" DROP CONSTRAINT IF EXISTS "Scan_organizationId_fkey";
ALTER TABLE "Scan" ADD CONSTRAINT "Scan_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Scan" DROP CONSTRAINT IF EXISTS "Scan_siteId_fkey";
ALTER TABLE "Scan" ADD CONSTRAINT "Scan_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Issue" DROP CONSTRAINT IF EXISTS "Issue_scanId_fkey";
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Fix" DROP CONSTRAINT IF EXISTS "Fix_issueId_fkey";
ALTER TABLE "Fix" ADD CONSTRAINT "Fix_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuditEvent" DROP CONSTRAINT IF EXISTS "AuditEvent_organizationId_fkey";
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UsageRecord" DROP CONSTRAINT IF EXISTS "UsageRecord_organizationId_fkey";
ALTER TABLE "UsageRecord" ADD CONSTRAINT "UsageRecord_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
