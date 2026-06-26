--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4 (Debian 15.4-2.pgdg120+1)
-- Dumped by pg_dump version 15.4 (Debian 15.4-2.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_institutionId_fkey";
ALTER TABLE IF EXISTS ONLY public."GrcUser" DROP CONSTRAINT IF EXISTS "GrcUser_institutionId_fkey";
ALTER TABLE IF EXISTS ONLY public."GrcUserRole" DROP CONSTRAINT IF EXISTS "GrcUserRole_institutionId_fkey";
ALTER TABLE IF EXISTS ONLY public."GrcUserRole" DROP CONSTRAINT IF EXISTS "GrcUserRole_id_user_fkey";
ALTER TABLE IF EXISTS ONLY public."GrcUserRole" DROP CONSTRAINT IF EXISTS "GrcUserRole_id_role_fkey";
ALTER TABLE IF EXISTS ONLY public."GrcRuleItem" DROP CONSTRAINT IF EXISTS "GrcRuleItem_id_rule_fkey";
ALTER TABLE IF EXISTS ONLY public."GrcRole" DROP CONSTRAINT IF EXISTS "GrcRole_institutionId_fkey";
ALTER TABLE IF EXISTS ONLY public."GrcRoleTrx" DROP CONSTRAINT IF EXISTS "GrcRoleTrx_role_name_fkey";
ALTER TABLE IF EXISTS ONLY public."GrcRoleTrx" DROP CONSTRAINT IF EXISTS "GrcRoleTrx_institutionId_fkey";
ALTER TABLE IF EXISTS ONLY public."GrcRiskRule" DROP CONSTRAINT IF EXISTS "GrcRiskRule_institutionId_fkey";
ALTER TABLE IF EXISTS ONLY public."GrcMitigation" DROP CONSTRAINT IF EXISTS "GrcMitigation_id_finding_fkey";
ALTER TABLE IF EXISTS ONLY public."GrcImportLog" DROP CONSTRAINT IF EXISTS "GrcImportLog_institutionId_fkey";
ALTER TABLE IF EXISTS ONLY public."GrcFinding" DROP CONSTRAINT IF EXISTS "GrcFinding_institutionId_fkey";
ALTER TABLE IF EXISTS ONLY public."GrcFinding" DROP CONSTRAINT IF EXISTS "GrcFinding_id_user_fkey";
ALTER TABLE IF EXISTS ONLY public."GrcFinding" DROP CONSTRAINT IF EXISTS "GrcFinding_id_run_fkey";
ALTER TABLE IF EXISTS ONLY public."GrcFinding" DROP CONSTRAINT IF EXISTS "GrcFinding_id_rule_fkey";
ALTER TABLE IF EXISTS ONLY public."GrcFinding" DROP CONSTRAINT IF EXISTS "GrcFinding_id_role_fkey";
ALTER TABLE IF EXISTS ONLY public."GrcAnalysisRun" DROP CONSTRAINT IF EXISTS "GrcAnalysisRun_institutionId_fkey";
DROP INDEX IF EXISTS public."User_email_key";
DROP INDEX IF EXISTS public."GrcUser_user_code_key";
DROP INDEX IF EXISTS public."GrcRole_role_name_key";
DROP INDEX IF EXISTS public."GrcRiskRule_rule_code_key";
DROP INDEX IF EXISTS public."GrcMitigation_id_finding_key";
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."Institution" DROP CONSTRAINT IF EXISTS "Institution_pkey";
ALTER TABLE IF EXISTS ONLY public."GrcUser" DROP CONSTRAINT IF EXISTS "GrcUser_pkey";
ALTER TABLE IF EXISTS ONLY public."GrcUserRole" DROP CONSTRAINT IF EXISTS "GrcUserRole_pkey";
ALTER TABLE IF EXISTS ONLY public."GrcRuleItem" DROP CONSTRAINT IF EXISTS "GrcRuleItem_pkey";
ALTER TABLE IF EXISTS ONLY public."GrcRole" DROP CONSTRAINT IF EXISTS "GrcRole_pkey";
ALTER TABLE IF EXISTS ONLY public."GrcRoleTrx" DROP CONSTRAINT IF EXISTS "GrcRoleTrx_pkey";
ALTER TABLE IF EXISTS ONLY public."GrcRiskRule" DROP CONSTRAINT IF EXISTS "GrcRiskRule_pkey";
ALTER TABLE IF EXISTS ONLY public."GrcMitigation" DROP CONSTRAINT IF EXISTS "GrcMitigation_pkey";
ALTER TABLE IF EXISTS ONLY public."GrcImportLog" DROP CONSTRAINT IF EXISTS "GrcImportLog_pkey";
ALTER TABLE IF EXISTS ONLY public."GrcFinding" DROP CONSTRAINT IF EXISTS "GrcFinding_pkey";
ALTER TABLE IF EXISTS ONLY public."GrcAnalysisRun" DROP CONSTRAINT IF EXISTS "GrcAnalysisRun_pkey";
DROP TABLE IF EXISTS public."User";
DROP TABLE IF EXISTS public."Institution";
DROP TABLE IF EXISTS public."GrcUserRole";
DROP TABLE IF EXISTS public."GrcUser";
DROP TABLE IF EXISTS public."GrcRuleItem";
DROP TABLE IF EXISTS public."GrcRoleTrx";
DROP TABLE IF EXISTS public."GrcRole";
DROP TABLE IF EXISTS public."GrcRiskRule";
DROP TABLE IF EXISTS public."GrcMitigation";
DROP TABLE IF EXISTS public."GrcImportLog";
DROP TABLE IF EXISTS public."GrcFinding";
DROP TABLE IF EXISTS public."GrcAnalysisRun";
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: GrcAnalysisRun; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."GrcAnalysisRun" (
    id_run text NOT NULL,
    run_name text NOT NULL,
    executed_by text NOT NULL,
    run_date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    scope_type text NOT NULL,
    scope_value text NOT NULL,
    status text NOT NULL,
    "institutionId" text NOT NULL
);


--
-- Name: GrcFinding; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."GrcFinding" (
    id_finding text NOT NULL,
    id_run text NOT NULL,
    id_user text,
    id_rule text NOT NULL,
    risk_level text NOT NULL,
    finding_status text NOT NULL,
    evidence_text text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "institutionId" text NOT NULL,
    id_role text
);


--
-- Name: GrcImportLog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."GrcImportLog" (
    id_import text NOT NULL,
    import_type text NOT NULL,
    file_name text NOT NULL,
    started_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    finished_at timestamp(3) without time zone,
    imported_by text NOT NULL,
    total_rows integer DEFAULT 0 NOT NULL,
    ok_rows integer DEFAULT 0 NOT NULL,
    error_rows integer DEFAULT 0 NOT NULL,
    result_status text NOT NULL,
    message_text text,
    "institutionId" text NOT NULL
);


--
-- Name: GrcMitigation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."GrcMitigation" (
    id_mitigation text NOT NULL,
    id_finding text NOT NULL,
    owner_name text NOT NULL,
    approval_status text NOT NULL,
    valid_until timestamp(3) without time zone,
    comments text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: GrcRiskRule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."GrcRiskRule" (
    id_rule text NOT NULL,
    rule_code text NOT NULL,
    rule_name text NOT NULL,
    rule_type text NOT NULL,
    risk_level text NOT NULL,
    description text,
    mitigation_text text,
    active_flag boolean DEFAULT true NOT NULL,
    "institutionId" text NOT NULL
);


--
-- Name: GrcRole; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."GrcRole" (
    id_role text NOT NULL,
    role_name text NOT NULL,
    role_desc text,
    process_area text,
    criticality text NOT NULL,
    status boolean DEFAULT true NOT NULL,
    "institutionId" text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: GrcRoleTrx; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."GrcRoleTrx" (
    id_role_trx text NOT NULL,
    role_name text NOT NULL,
    transaction text NOT NULL,
    "institutionId" text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    field text NOT NULL,
    object text NOT NULL
);


--
-- Name: GrcRuleItem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."GrcRuleItem" (
    id_rule_item text NOT NULL,
    id_rule text NOT NULL,
    object_type text NOT NULL,
    object_value text NOT NULL,
    seq_no integer NOT NULL
);


--
-- Name: GrcUser; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."GrcUser" (
    id_user text NOT NULL,
    user_code text NOT NULL,
    full_name text NOT NULL,
    email text,
    status boolean DEFAULT true NOT NULL,
    source_system text,
    "institutionId" text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: GrcUserRole; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."GrcUserRole" (
    id_user_role text NOT NULL,
    id_user text NOT NULL,
    id_role text NOT NULL,
    assigned_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    valid_from timestamp(3) without time zone,
    valid_to timestamp(3) without time zone,
    status boolean DEFAULT true NOT NULL,
    "institutionId" text NOT NULL
);


--
-- Name: Institution; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Institution" (
    id text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    password text NOT NULL,
    "institutionId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Data for Name: GrcAnalysisRun; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."GrcAnalysisRun" (id_run, run_name, executed_by, run_date, scope_type, scope_value, status, "institutionId") FROM stdin;
e0258844-c092-4b4a-a2a4-7c1bdd03683f	test1	Esteban Osorio	2026-06-23 19:00:20.442	User-Based	ALL	Completed	inst1
fa17096f-e794-4e57-bb7d-174e7c146d47	Exec Jun 2026	MMorales	2026-06-23 19:25:04.407	User-Based	ALL	Completed	inst1
\.


--
-- Data for Name: GrcFinding; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."GrcFinding" (id_finding, id_run, id_user, id_rule, risk_level, finding_status, evidence_text, created_at, "institutionId", id_role) FROM stdin;
8d9518b0-81da-4dd9-99eb-d0d2834e880a	e0258844-c092-4b4a-a2a4-7c1bdd03683f	c6434934-6201-4ba0-80a8-69b854948f16	bdae59df-3bd7-4f2f-9b62-542ad022272b	HIGH	Open	User role contains conflicting transactions: PA30, PC00_M99_PA03_CORR	2026-06-23 19:00:20.549	inst1	07e45bc3-972a-4fad-94f7-87c48f40ae14
580e122a-56a1-4953-98ba-658c183e1517	e0258844-c092-4b4a-a2a4-7c1bdd03683f	c6434934-6201-4ba0-80a8-69b854948f16	6cff4ad2-f546-481b-9206-fbefa2303095	HIGH	Open	User role contains conflicting transactions: PA30, PC00_M99_PA03_CORR	2026-06-23 19:00:20.555	inst1	07e45bc3-972a-4fad-94f7-87c48f40ae14
88886559-ad81-45bf-be9e-e0228f6c0e5f	fa17096f-e794-4e57-bb7d-174e7c146d47	c6434934-6201-4ba0-80a8-69b854948f16	bdae59df-3bd7-4f2f-9b62-542ad022272b	HIGH	Open	User role contains conflicting transactions: PA30, PC00_M99_PA03_CORR	2026-06-23 19:25:04.441	inst1	07e45bc3-972a-4fad-94f7-87c48f40ae14
3531d440-fef2-47b8-935f-232f2bd62568	fa17096f-e794-4e57-bb7d-174e7c146d47	c6434934-6201-4ba0-80a8-69b854948f16	6cff4ad2-f546-481b-9206-fbefa2303095	HIGH	Open	User role contains conflicting transactions: PA30, PC00_M99_PA03_CORR	2026-06-23 19:25:04.448	inst1	07e45bc3-972a-4fad-94f7-87c48f40ae14
\.


--
-- Data for Name: GrcImportLog; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."GrcImportLog" (id_import, import_type, file_name, started_at, finished_at, imported_by, total_rows, ok_rows, error_rows, result_status, message_text, "institutionId") FROM stdin;
c1aebf28-87a4-4708-8786-a69e08a3a995	users	users.upload.xlsx	2026-05-08 15:42:28.03	2026-05-08 15:42:28.29	system-auditor	3	0	3	Failed	Processed 0 successfully. Failures: \nInvalid `this.prisma.grcUser.upsert()` invocation in\nC:\\xampp\\htdocs\\mygrc\\apps\\api\\src\\data-upload\\data-upload.service.ts:129:37\n\n  126 if (!row.user_code) throw new Error(`Row ${i + 2}: User Code is mandatory`);\n  127 if (row.email && !this.validateEmail(row.email)) throw new Error(`Row ${i + 2}: Invalid email format`);\n  128 \n→ 129 await this.prisma.grcUser.upsert(\nForeign key constraint violated on the constraint: `GrcUser_institutionId_fkey`; \nInvalid `this.prisma.grcUser.upsert()` invocation in\nC:\\xampp\\htdocs\\mygrc\\apps\\api\\src\\data-upload\\data-upload.service.ts:129:37\n\n  126 if (!row.user_code) throw new Error(`Row ${i + 2}: User Code is mandatory`);\n  127 if (row.email && !this.validateEmail(row.email)) throw new Error(`Row ${i + 2}: Invalid email format`);\n  128 \n→ 129 await this.prisma.grcUser.upsert(\nForeign key constraint violated on the constraint: `GrcUser_institutionId_fkey`; \nInvalid `this.prisma.grcUser.upsert()` invocation in\nC:\\xampp\\htdocs\\mygrc\\apps\\api\\src\\data-upload\\data-upload.service.ts:129:37\n\n  126 if (!row.user_code) throw new Error(`Row ${i + 2}: User Code is mandatory`);\n  127 if (row.email && !this.validateEmail(row.email)) throw new Error(`Row ${i + 2}: Invalid email format`);\n  128 \n→ 129 await this.prisma.grcUser.upsert(\nForeign key constraint violated on the constraint: `GrcUser_institutionId_fkey`	inst1
799e6bc6-5a5b-4f74-85c5-095aad7dd806	users	users.upload.xlsx	2026-05-08 19:52:10.886	2026-05-08 19:52:11.008	system-auditor	3	0	3	Failed	Processed 0 successfully. Failures: \nInvalid `this.prisma.grcUser.upsert()` invocation in\nC:\\xampp\\htdocs\\mygrc\\apps\\api\\src\\data-upload\\data-upload.service.ts:129:37\n\n  126 if (!row.user_code) throw new Error(`Row ${i + 2}: User Code is mandatory`);\n  127 if (row.email && !this.validateEmail(row.email)) throw new Error(`Row ${i + 2}: Invalid email format`);\n  128 \n→ 129 await this.prisma.grcUser.upsert(\nForeign key constraint violated on the constraint: `GrcUser_institutionId_fkey`; \nInvalid `this.prisma.grcUser.upsert()` invocation in\nC:\\xampp\\htdocs\\mygrc\\apps\\api\\src\\data-upload\\data-upload.service.ts:129:37\n\n  126 if (!row.user_code) throw new Error(`Row ${i + 2}: User Code is mandatory`);\n  127 if (row.email && !this.validateEmail(row.email)) throw new Error(`Row ${i + 2}: Invalid email format`);\n  128 \n→ 129 await this.prisma.grcUser.upsert(\nForeign key constraint violated on the constraint: `GrcUser_institutionId_fkey`; \nInvalid `this.prisma.grcUser.upsert()` invocation in\nC:\\xampp\\htdocs\\mygrc\\apps\\api\\src\\data-upload\\data-upload.service.ts:129:37\n\n  126 if (!row.user_code) throw new Error(`Row ${i + 2}: User Code is mandatory`);\n  127 if (row.email && !this.validateEmail(row.email)) throw new Error(`Row ${i + 2}: Invalid email format`);\n  128 \n→ 129 await this.prisma.grcUser.upsert(\nForeign key constraint violated on the constraint: `GrcUser_institutionId_fkey`	inst1
357984b9-be9f-4930-abbb-6843293a8ba8	users	users.upload.xlsx	2026-05-08 19:59:43.734	2026-05-08 19:59:43.803	system-auditor	3	3	0	Success	Processed 3 successfully.	inst1
81191dfd-2a03-4ea0-bae0-a1906ba86f10	roles	roles.xlsx	2026-05-08 20:01:30.147	2026-05-08 20:01:30.259	system-auditor	4	0	4	Failed	Processed 0 successfully. Failures: \nInvalid `this.prisma.grcRole.upsert()` invocation in\nC:\\xampp\\htdocs\\mygrc\\apps\\api\\src\\data-upload\\data-upload.service.ts:150:37\n\n  147 else if (type === 'roles') {\n  148   if (!row.role_name) throw new Error(`Row ${i + 2}: Role Name is mandatory`);\n  149 \n→ 150   await this.prisma.grcRole.upsert(\nForeign key constraint violated on the constraint: `GrcRole_institutionId_fkey`; \nInvalid `this.prisma.grcRole.upsert()` invocation in\nC:\\xampp\\htdocs\\mygrc\\apps\\api\\src\\data-upload\\data-upload.service.ts:150:37\n\n  147 else if (type === 'roles') {\n  148   if (!row.role_name) throw new Error(`Row ${i + 2}: Role Name is mandatory`);\n  149 \n→ 150   await this.prisma.grcRole.upsert(\nForeign key constraint violated on the constraint: `GrcRole_institutionId_fkey`; \nInvalid `this.prisma.grcRole.upsert()` invocation in\nC:\\xampp\\htdocs\\mygrc\\apps\\api\\src\\data-upload\\data-upload.service.ts:150:37\n\n  147 else if (type === 'roles') {\n  148   if (!row.role_name) throw new Error(`Row ${i + 2}: Role Name is mandatory`);\n  149 \n→ 150   await this.prisma.grcRole.upsert(\nForeign key constraint violated on the constraint: `GrcRole_institutionId_fkey`; \nInvalid `this.prisma.grcRole.upsert()` invocation in\nC:\\xampp\\htdocs\\mygrc\\apps\\api\\src\\data-upload\\data-upload.service.ts:150:37\n\n  147 else if (type === 'roles') {\n  148   if (!row.role_name) throw new Error(`Row ${i + 2}: Role Name is mandatory`);\n  149 \n→ 150   await this.prisma.grcRole.upsert(\nForeign key constraint violated on the constraint: `GrcRole_institutionId_fkey`	inst1
38d1d93f-6762-4387-bc60-d36e6df35894	roles	roles.xlsx	2026-05-08 20:02:26.165	2026-05-08 20:02:26.263	system-auditor	4	4	0	Success	Processed 4 successfully.	inst1
a17a66f9-ccd9-4d7d-ae6e-01db2f4744d8	assignments	user_assign_roles.xlsx	2026-05-08 20:03:49.065	2026-05-08 20:03:49.12	system-auditor	4	4	0	Success	Processed 4 successfully.	inst1
ebc30019-3ea7-4b59-9425-ce5d11aafd87	risk-rules	grc_risk_rule.xlsx	2026-05-08 20:07:52.735	2026-05-08 20:07:54.048	system-auditor	365	365	0	Success	Processed 365 successfully.	inst1
27e8fcf3-1aee-4854-b7da-462c65a043fc	rule-items	grc_rule_item.xlsx	2026-05-08 20:08:44.277	2026-05-08 20:08:48.473	system-auditor	730	730	0	Success	Processed 730 successfully.	inst1
fa24fd65-ed3f-47c6-924e-1440489aa566	role-transactions	AGR_1251.xlsx	2026-05-08 20:18:40.918	2026-05-08 20:18:52.748	system-auditor	79761	0	79761	Failed	Processed 0 successfully. Failures: Row 2: role_name, object, field, and transaction are required; Row 3: role_name, object, field, and transaction are required; Row 4: role_name, object, field, and transaction are required; Row 5: role_name, object, field, and transaction are required; Row 6: role_name, object, field, and transaction are required...	inst1
af814dae-467c-44f0-9b21-61f4538d7e2b	role-transactions	AGR_1251.xlsx	2026-05-08 20:20:21.771	2026-05-08 20:20:25.833	system-auditor	79761	0	79761	Failed	Processed 0 successfully. Failures: Row 2: role_name, object, field, and transaction are required; Row 3: role_name, object, field, and transaction are required; Row 4: role_name, object, field, and transaction are required; Row 5: role_name, object, field, and transaction are required; Row 6: role_name, object, field, and transaction are required...	inst1
aac5aa0b-521f-4e44-93b5-6386eb21a671	role-transactions	AGR_1251.xlsx	2026-05-08 20:22:59.327	2026-05-08 20:23:25.341	system-auditor	9078	0	9078	Failed	Processed 0 successfully. Failures: Row 2: Role ZECH:HRPY_SOPORTE                not found; Row 3: Role ZECH:HRPY_SOPORTE                not found; Row 4: Role ZECH:HRPY_SOPORTE                not found; Row 5: Role ZECH:HRPY_SOPORTE                not found; Row 6: Role ZECH:HRPY_SOPORTE                not found...	inst1
8d7d6832-e9a3-4c6c-aa81-610f7dc43352	role-transactions	AGR_1251.xlsx	2026-05-08 20:26:14.809	2026-05-08 20:26:18.32	system-auditor	136	0	136	Failed	Processed 0 successfully. Failures: \nInvalid `this.prisma.grcRoleTrx.create()` invocation in\nC:\\xampp\\htdocs\\mygrc\\apps\\api\\src\\data-upload\\data-upload.service.ts:265:42\n\n  262 });\n  263 \n  264 if (!existingTrx) {\n→ 265   await this.prisma.grcRoleTrx.create(\nForeign key constraint violated on the constraint: `GrcRoleTrx_institutionId_fkey`; \nInvalid `this.prisma.grcRoleTrx.create()` invocation in\nC:\\xampp\\htdocs\\mygrc\\apps\\api\\src\\data-upload\\data-upload.service.ts:265:42\n\n  262 });\n  263 \n  264 if (!existingTrx) {\n→ 265   await this.prisma.grcRoleTrx.create(\nForeign key constraint violated on the constraint: `GrcRoleTrx_institutionId_fkey`; \nInvalid `this.prisma.grcRoleTrx.create()` invocation in\nC:\\xampp\\htdocs\\mygrc\\apps\\api\\src\\data-upload\\data-upload.service.ts:265:42\n\n  262 });\n  263 \n  264 if (!existingTrx) {\n→ 265   await this.prisma.grcRoleTrx.create(\nForeign key constraint violated on the constraint: `GrcRoleTrx_institutionId_fkey`; \nInvalid `this.prisma.grcRoleTrx.create()` invocation in\nC:\\xampp\\htdocs\\mygrc\\apps\\api\\src\\data-upload\\data-upload.service.ts:265:42\n\n  262 });\n  263 \n  264 if (!existingTrx) {\n→ 265   await this.prisma.grcRoleTrx.create(\nForeign key constraint violated on the constraint: `GrcRoleTrx_institutionId_fkey`; \nInvalid `this.prisma.grcRoleTrx.create()` invocation in\nC:\\xampp\\htdocs\\mygrc\\apps\\api\\src\\data-upload\\data-upload.service.ts:265:42\n\n  262 });\n  263 \n  264 if (!existingTrx) {\n→ 265   await this.prisma.grcRoleTrx.create(\nForeign key constraint violated on the constraint: `GrcRoleTrx_institutionId_fkey`...	inst1
b547de7f-c126-4652-9b8a-fd5d611d7531	role-transactions	AGR_1251.xlsx	2026-05-08 20:27:13.651	2026-05-08 20:27:17.063	system-auditor	122	0	122	Failed	Processed 0 successfully. Failures: \nInvalid `this.prisma.grcRoleTrx.create()` invocation in\nC:\\xampp\\htdocs\\mygrc\\apps\\api\\src\\data-upload\\data-upload.service.ts:265:42\n\n  262 });\n  263 \n  264 if (!existingTrx) {\n→ 265   await this.prisma.grcRoleTrx.create(\nForeign key constraint violated on the constraint: `GrcRoleTrx_institutionId_fkey`; \nInvalid `this.prisma.grcRoleTrx.create()` invocation in\nC:\\xampp\\htdocs\\mygrc\\apps\\api\\src\\data-upload\\data-upload.service.ts:265:42\n\n  262 });\n  263 \n  264 if (!existingTrx) {\n→ 265   await this.prisma.grcRoleTrx.create(\nForeign key constraint violated on the constraint: `GrcRoleTrx_institutionId_fkey`; \nInvalid `this.prisma.grcRoleTrx.create()` invocation in\nC:\\xampp\\htdocs\\mygrc\\apps\\api\\src\\data-upload\\data-upload.service.ts:265:42\n\n  262 });\n  263 \n  264 if (!existingTrx) {\n→ 265   await this.prisma.grcRoleTrx.create(\nForeign key constraint violated on the constraint: `GrcRoleTrx_institutionId_fkey`; \nInvalid `this.prisma.grcRoleTrx.create()` invocation in\nC:\\xampp\\htdocs\\mygrc\\apps\\api\\src\\data-upload\\data-upload.service.ts:265:42\n\n  262 });\n  263 \n  264 if (!existingTrx) {\n→ 265   await this.prisma.grcRoleTrx.create(\nForeign key constraint violated on the constraint: `GrcRoleTrx_institutionId_fkey`; \nInvalid `this.prisma.grcRoleTrx.create()` invocation in\nC:\\xampp\\htdocs\\mygrc\\apps\\api\\src\\data-upload\\data-upload.service.ts:265:42\n\n  262 });\n  263 \n  264 if (!existingTrx) {\n→ 265   await this.prisma.grcRoleTrx.create(\nForeign key constraint violated on the constraint: `GrcRoleTrx_institutionId_fkey`...	inst1
39d50229-2b0a-4142-b5d0-86cbced82237	role-transactions	AGR_1251.xlsx	2026-05-08 20:28:08.824	2026-05-08 20:28:10.078	system-auditor	122	122	0	Success	Processed 122 successfully.	inst1
0030c458-c6f9-45b4-aed8-67ebc2762e55	risk-rules	grc_risk_rule.xlsx	2026-05-08 21:12:44.136	2026-05-08 21:12:45.83	system-auditor	365	365	0	Success	Processed 365 successfully.	inst1
80ac81c0-f21f-4018-98f5-d18db57dcfeb	role-transactions	AGR_1251.xlsx	2026-05-08 21:21:36.774	2026-05-08 21:21:37.61	system-auditor	122	122	0	Success	Processed 122 successfully.	inst1
857a9d28-f832-4530-a504-2401a6737407	role-transactions	AGR_1251.xlsx	2026-05-08 21:21:44.802	2026-05-08 21:21:46.091	system-auditor	122	122	0	Success	Processed 122 successfully.	inst1
fa6baad6-6ad3-496b-9120-29b76dab291a	rule-items	grc_rule_item.xlsx	2026-05-08 22:28:30.172	2026-05-08 22:28:37.652	system-auditor	730	730	0	Success	Processed 730 successfully.	inst1
\.


--
-- Data for Name: GrcMitigation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."GrcMitigation" (id_mitigation, id_finding, owner_name, approval_status, valid_until, comments, created_at) FROM stdin;
\.


--
-- Data for Name: GrcRiskRule; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."GrcRiskRule" (id_rule, rule_code, rule_name, rule_type, risk_level, description, mitigation_text, active_flag, "institutionId") FROM stdin;
02a2ba23-f5d4-47cd-9fd4-d8290503f4b9	R_HCM_0270	Contract Termination Processes (Liquidación y Amortización) no deben ejecutarse en paralelo para el mismo empleado.	TCODE	HIGH	Procesos de fin de contrato (Liquidación y Amortización) no deben ejecutarse en paralelo para el mismo empleado.	\N	t	inst1
02e80164-c327-48cb-bd54-7f2f816b250a	R_HCM_0292	New and Legacy Versions of the Payroll Simulator. No deben usarse indistintamente.	TCODE	MEDIUM	Versiones nueva y antigua del simulador de nómina. No deben usarse indistintamente.	\N	t	inst1
03d7cbc6-fae8-49d3-82ce-1f3fca8cef3a	R_HCM_0081	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
06a0b253-653b-4ccc-8f58-4226a72f4e5c	R_HCM_0228	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
07c113d3-3778-4167-85c4-9c4f507b91c2	R_HCM_0078	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
09636a9e-b93f-4de1-90d9-7963f1b084f3	R_HCM_0098	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
11ebee10-39a8-4b6e-903a-dba0d05dd2cf	R_HCM_0090	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
15ae1026-ace2-4502-b42c-ff308835394e	R_HCM_0112	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
1619bee7-882d-4477-a033-71740740c52e	R_HCM_0097	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
17a08be4-40e7-4f09-91da-4b9fcf367339	R_HCM_0102	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
1840eaf3-7376-4f2f-afb7-8ed0de38c73d	R_HCM_0101	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
2596284c-3cf6-41f4-bfc7-eca307e9d5d8	R_HCM_0084	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
25c61509-23de-4862-9235-129b79ac2a9f	R_HCM_0092	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
27bcca27-e6fa-40a2-889a-4f18b312fa37	R_HCM_0083	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
27cbde8d-047b-4212-88bb-cc6936dceada	R_HCM_0069	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
2c4394cf-34d1-41e4-a8bd-844576b33e65	R_HCM_0063	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
3042e0f6-06eb-4ef9-82c9-ad12a70a02d1	R_HCM_0121	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
4043f622-492e-4d5c-a2bc-717674db317f	R_HCM_0118	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
4680d9d5-4567-412d-856d-8e3cc3d64714	R_HCM_0117	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
4b1bcb36-fc29-4d5a-b8cc-5d45eaca125f	R_HCM_0065	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
4b3bf07d-43fa-4698-9cff-22088a60dda8	R_HCM_0109	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
58ab7f46-e879-45db-8819-5265096b9b20	R_HCM_0104	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
59c51eb4-f3bc-47ce-b3f5-bfd2ec442fd4	R_HCM_0114	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
60e18d18-0212-4d88-85a7-803554af7743	R_HCM_0120	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
63d53c58-2588-412c-871c-4ea5dc88e937	R_HCM_0079	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
64541df8-1a9a-44f8-b0f4-3ac1106d371b	R_HCM_0094	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
6d04bf31-f2ea-4ac9-af41-24fb7b0c502d	R_HCM_0072	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
6d802fc3-c2e2-4599-a4b8-d7aa96563ca0	R_HCM_0082	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
6e2ddca3-a0bb-4c9e-bbb9-8d3da5f322d8	R_HCM_0088	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
6ec8d062-5bbb-45ef-a7f0-7e00c788dfd9	R_HCM_0060	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
6f4dfe6a-f4a5-49a7-9bfb-40c69e72b647	R_HCM_0116	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
72126de4-fa29-4983-935c-1f182ce7b5a8	R_HCM_0074	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
74a7342e-c879-4808-80ba-fc246ef699f1	R_HCM_0066	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
7ec514c3-2b66-4b27-b9ec-d976ceeac0a6	R_HCM_0095	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
7f8445a4-e35d-416b-a266-54f6ef0794b1	R_HCM_0080	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
85b644a5-18e6-4951-9103-f2fd0d959143	R_HCM_0073	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
8643f0d3-f40f-4146-a162-e1f32ad65761	R_HCM_0096	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
86a8c8e4-186e-411e-9acb-b1f086da527a	R_HCM_0086	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
87e01de7-4989-40db-a694-597277e6dcea	R_HCM_0076	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
8b9c3baa-0387-496f-9bcb-175124660e9f	R_HCM_0061	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
8d84b47f-76c6-4047-b79b-f88f59209e13	R_HCM_0077	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
95e2b4bb-ffbe-4c5f-b661-398b1a6def51	R_HCM_0087	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
96c3d5da-cae7-4860-a5f8-1d2300b0efef	R_HCM_0064	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
97934e8a-2b46-490e-bea9-2007460ac8b4	R_HCM_0100	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
9a99d409-15a5-494d-aafd-da0805bc30ec	R_HCM_0062	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
9c4e34f7-b53f-4f29-a8b0-49fcbd644511	R_HCM_0115	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
9e944468-dba7-4584-a168-f162e0a24e56	R_HCM_0106	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
a6975ed1-b1c1-4baa-9be7-82b9d9e9e6e1	R_HCM_0085	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
b30ad862-a1d6-4a37-8574-aa49bce160be	R_HCM_0099	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
b585b9f1-8d62-4c86-b187-7c55a97f4838	R_HCM_0068	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
d24b662c-143a-49ef-a996-ff438fbc1bbc	R_HCM_0067	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
d42bd1d1-89f9-4ef4-a559-e605ad0fcdc0	R_HCM_0108	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
d7a196c5-5ecb-4adc-ba6b-9beeda9bdfd3	R_HCM_0103	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
db37f0c0-3b25-4eb6-b38e-a59d4450a248	R_HCM_0089	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
db86415e-fb33-449d-a654-2a792643730e	R_HCM_0107	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
dfc6863b-e211-494d-8af5-e69f0a2477b6	R_HCM_0075	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
e41d82bd-55ad-46ca-b569-118fe9d502c9	R_HCM_0113	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
ec92dbd3-7bbf-436d-b661-bab5f486d51e	R_HCM_0119	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
f0e11df1-4e8c-4fd9-a45b-7012dac75106	R_HCM_0105	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
f38a0baf-dc0a-4b18-87fe-839addd27f6b	R_HCM_0091	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
f693f36b-9dff-4900-9146-3b81ab1d75bf	R_HCM_0071	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
f7c83f7c-da74-4d93-a885-152336e005c2	R_HCM_0093	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
f7c85c9f-cd96-4efb-b9cc-452a4e4e5f0c	R_HCM_0070	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
fa5b6b0a-3b6c-4650-9e3e-215f64bb13f5	R_HCM_0110	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
faaa787d-e359-4a66-ba80-f0925e24365d	R_HCM_0111	Transaction SECATT must not be assigned	TCODE	MEDIUM	Transaccion SECATT no debe ser asignada	\N	t	inst1
004cffca-0daa-4f19-b2ef-9d20735a67ad	R_HCM_0191	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
c1cd067f-b412-44d5-a8a3-87676f03168f	R_HCM_0238	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Role Maintenance - Transacciones operativas - Revisión trimestral	\N	t	inst1
069040b1-5485-4434-a5e4-980621214900	R_HCM_0239	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Role Maintenance - Transacciones operativas - Revisión trimestral	\N	t	inst1
805ce5f0-0c2d-46ce-bef0-5f43aff37513	R_HCM_0240	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Role Maintenance - Transacciones operativas - Revisión trimestral	\N	t	inst1
46a4b7ff-2948-426b-be8e-185afbf4f52c	R_HCM_0167	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
854aea20-3a96-4057-ab70-942497e63e70	R_HCM_0168	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
3693ebb7-ce17-40a4-b311-7002614941d7	R_HCM_0169	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
3b81e894-152b-47db-8199-079a20aa781a	R_HCM_0170	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
5754f60d-81a8-46c2-bd21-14285025b84e	R_HCM_0171	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
d032d91f-24f1-42c0-afeb-ca1d9608b647	R_HCM_0172	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
45cc51d3-fd84-450a-a879-0642a3df0cff	R_HCM_0173	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
bdd5bace-ca07-48a2-913c-132aa4cd1b5d	R_HCM_0174	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
8c596dd6-34cd-449b-8181-c4bf5e07d970	R_HCM_0176	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
5f997153-5f22-472d-b07b-4fc65e408712	R_HCM_0177	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
82b6f4f0-35dd-428d-9750-0e615abf1171	R_HCM_0178	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
0dbdce62-8954-4076-ab4e-2b0be11288b5	R_HCM_0179	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
a176a243-98c7-4685-911c-36b122cc8d58	R_HCM_0180	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
a7e83534-de7b-44f6-9d64-5830746c11aa	R_HCM_0181	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
e5113501-693c-405c-8d7d-af49b552f0e8	R_HCM_0182	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
4dd2fc1a-abee-442c-b43f-c37963b13f5e	R_HCM_0183	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
4e7400a8-56d8-401a-b9f8-77684ddae390	R_HCM_0185	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
65c0a4b8-b653-4da9-b088-35d7d587b756	R_HCM_0186	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
7507409c-d589-4003-9af0-a0d55ade280b	R_HCM_0187	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
695555fa-0b1c-47a5-98f2-62f4e6c59404	R_HCM_0188	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
ba8b82ce-8f5b-44e6-93a9-9cd4870e8256	R_HCM_0189	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
9fbe0fad-0451-47dd-89ee-3d17559aeb3d	R_HCM_0190	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
a0a377b1-2c0f-4acc-8f41-9e80b494626d	R_HCM_0192	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
17a70478-07a0-4b7a-849e-b5230dd85c58	R_HCM_0193	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
9df3774c-8c55-490c-b6aa-2273b39ad698	R_HCM_0194	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
d73acc8c-5d6a-4271-823b-ff4b0718e2d7	R_HCM_0195	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
6760f39b-78f7-4acb-aecd-a8077206fb62	R_HCM_0196	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
da6226a6-4577-4ddf-9522-e0f2ca5082f1	R_HCM_0197	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
0f31d459-cd4d-4a2e-8697-bd753ec4eaac	R_HCM_0199	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
cbcd53a6-20d5-4eb2-b07d-f0182fc6e87d	R_HCM_0200	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
8d55524d-1e50-4614-9a6b-716e3a7a254c	R_HCM_0201	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
42ee7811-da67-4f09-95dc-5a1712d0696d	R_HCM_0202	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
c7acbf45-e6c1-470d-ad3e-c1c07d8cde23	R_HCM_0203	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
916fae5f-e75a-4504-85af-11b472f48cfc	R_HCM_0204	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
1b6c5949-eb0f-42f7-a737-9644d205dca9	R_HCM_0205	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
f4ceacd1-4b83-44b1-a9c2-10f47c9944ac	R_HCM_0206	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
12f6fd57-85fa-4349-a327-6693a6446a42	R_HCM_0207	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
7b1e905c-5380-40e3-89c1-0b664782a35d	R_HCM_0208	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
cd1080bd-a9a1-41dc-a242-7699cbeed79a	R_HCM_0209	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
872af311-dad1-47e1-a69d-d90d5074a59a	R_HCM_0210	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
f8bbb749-3bcc-4037-a61d-7dac0ec6ae39	R_HCM_0211	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
eb93d63c-1177-451b-b72d-e8a89c3c7972	R_HCM_0212	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
4131a555-261f-445e-b18f-42a71a402bff	R_HCM_0213	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
52b35678-7f5d-497f-a576-2fef6c4c5ed7	R_HCM_0214	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
26ff9fbf-e5fc-46e2-9b0b-3222a68f55b8	R_HCM_0215	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
73a2ace3-27ba-4b53-9249-421cfe2b86cb	R_HCM_0216	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
ebce1550-a44f-4b87-a345-e6d4b51b4537	R_HCM_0217	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
23ed5a26-b9dd-4c4d-9f2c-4dcf2857c874	R_HCM_0218	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
6e9dbde8-4258-4856-af1b-cec2abab1062	R_HCM_0219	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
838cee0d-eb0a-438e-adc7-1d54bc0fbeb3	R_HCM_0220	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
777a17db-120c-44e8-a48c-6b3ab236aa9d	R_HCM_0221	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
80443d5b-1722-4853-8dbd-ad765ace4db6	R_HCM_0222	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
83502333-df03-44a0-94c6-90d987bf39ff	R_HCM_0223	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
cc06ead5-64a5-4f33-a0bf-0c3186752adf	R_HCM_0224	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
bf40ca9e-d2cf-4a2c-8ddd-c5deb1eee8a3	R_HCM_0225	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
cd193e3b-1db1-42e1-be72-ca8600bb4f56	R_HCM_0226	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
d7aa7564-48df-412d-91df-8db5084e81c2	R_HCM_0227	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
09e06b2a-9fb4-448b-a527-11455aa540b4	R_HCM_0175	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
0cb992d7-3697-4b2f-a0ea-d554fc1af899	R_HCM_0184	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
bdae59df-3bd7-4f2f-9b62-542ad022272b	R_HCM_0001	Mantener datos vs Corregir nóminas	TCODE	HIGH	Mantener datos vs Corregir nómina		t	inst1
07e06fdd-3234-4070-84a1-83ef453b15cb	R_HCM_0022	Stratum Calculation vs Process	TCODE	HIGH	Cálculo estrato vs Procesar	\N	t	inst1
0947410b-5b5d-47a0-89d9-ac3aacee774c	R_HCM_0033	Incentives vs Incentive Payment	TCODE	HIGH	Incentivos vs Pago incentivos	\N	t	inst1
76f8cb99-c5ee-4878-b527-6278f7b0aea8	R_HCM_0002	Mantener datos vs Calcular nómina	TCODE	HIGH	Mantener datos vs Calcular nómina	\N	t	inst1
7039c0e5-60a5-45ee-8001-97ca991e10e2	R_HCM_0003	Mantener datos vs Liberar nómina	TCODE	HIGH	Mantener datos vs Liberar nómina	\N	t	inst1
c856690a-08f1-46e1-a7d4-0f40c9c4b7f1	R_HCM_0004	Mantener datos vs Finalizar nómina	TCODE	HIGH	Mantener datos vs Finalizar nómina	\N	t	inst1
2ae52bf3-0870-456d-bc35-2a26b8efd10e	R_HCM_0005	Datos bancarios vs Deducciones	TCODE	HIGH	Datos bancarios vs Deducciones	\N	t	inst1
7dff10a6-9821-435f-b26e-a2de00c0f43f	R_HCM_0006	Múltiples infotypes nómina	TCODE	HIGH	Múltiples infotypes nómina	\N	t	inst1
19d0959a-d961-44e9-9d84-ac8e35e6ec81	R_HCM_0007	Múltiples infotypes sensibles	TCODE	HIGH	Múltiples infotypes sensibles	\N	t	inst1
700ceb21-0474-4973-a174-2252b797c7a8	R_HCM_0008	Calcular vs Corregir nómina	TCODE	MEDIUM	Calcular vs Corregir nómina	\N	t	inst1
187dd551-bf85-4d76-a629-8d823966e561	R_HCM_0009	Liberar vs Corregir nómina	TCODE	HIGH	Liberar vs Corregir nómina	\N	t	inst1
71cae3f6-fd09-4400-968c-76a8759a8f13	R_HCM_0010	Copiar vs Crear nómina	TCODE	HIGH	Copiar vs Crear nómina	\N	t	inst1
6407d89c-f348-415e-af7e-5bac4ad9b400	R_HCM_0011	Consulta vs Modificación datos	TCODE	MEDIUM	Consulta vs Modificación datos	\N	t	inst1
b7ab4ecb-0e18-4c2b-a3eb-9cd2f3294fb4	R_HCM_0012	Ver vs Editar resultados	TCODE	HIGH	Ver vs Editar resultados	\N	t	inst1
9a16fde8-c0c7-48ec-abc7-a88bde1257e3	R_HCM_0013	Crear puestos vs Liberar nómina	TCODE	HIGH	Crear puestos vs Liberar nómina	\N	t	inst1
4206751b-8698-4bd4-8e92-e413c004b758	R_HCM_0014	Mantenimiento tablas vs Procesos	TCODE	HIGH	Mantenimiento tablas vs Procesos	\N	t	inst1
efd7407b-9e8b-435c-b465-f9f599bac375	R_HCM_0015	Múltiples auth procesos nómina	TCODE	HIGH	Múltiples auth procesos nómina	\N	t	inst1
d5e06645-d643-4e8f-b36f-a741cc51e51a	R_HCM_0016	Importar vs Comparar datos	TCODE	LOW	Importar vs Comparar datos	\N	t	inst1
7db90b0f-1728-4434-92ff-5f8d580dbad6	R_HCM_0017	Diferentes funciones edición	TCODE	HIGH	Diferentes funciones edición	\N	t	inst1
c4e30c37-40e1-49fa-bf28-9767b50af505	R_HCM_0018	Preliminar vs Aprobar nómina	TCODE	HIGH	Preliminar vs Aprobar nómina	\N	t	inst1
8cdfe73e-5798-424b-a25e-9eb8fcafabf9	R_HCM_0019	Preliminar vs Corregir	TCODE	HIGH	Preliminar vs Corregir	\N	t	inst1
3e2514ad-9534-4c62-baae-204c9387e52f	R_HCM_0020	Aprobar vs Corregir	TCODE	HIGH	Aprobar vs Corregir	\N	t	inst1
aa55da05-05ce-4c7c-bcd5-c5cf490d73c9	R_HCM_0021	Proceso nómina vs Ajustes	TCODE	HIGH	Proceso nómina vs Ajustes	\N	t	inst1
3ad8a08c-11db-42aa-8953-7034c11aadcc	R_HCM_0023	Proyección vs Pago real	TCODE	HIGH	Proyección vs Pago real	\N	t	inst1
bc806e1b-bd1d-4393-bc31-dc12227ca6eb	R_HCM_0024	Cálculo vs Corrección impuestos	TCODE	HIGH	Cálculo vs Corrección impuestos	\N	t	inst1
fc2e24ec-d7b6-47ae-b61f-6ede5a6157c9	R_HCM_0025	Bonus vs Corrección bonus	TCODE	HIGH	Bonus vs Corrección bonus	\N	t	inst1
67638211-bb51-4799-ab9d-8f2f920c0ebb	R_HCM_0026	Vacaciones vs Pago vacaciones	TCODE	HIGH	Vacaciones vs Pago vacaciones	\N	t	inst1
8061c5a6-f18a-4995-bf90-d87de67b9361	R_HCM_0027	Préstamos vs Ajuste préstamos	TCODE	HIGH	Préstamos vs Ajuste préstamos	\N	t	inst1
9d77ca55-5c45-4cf3-8602-5bced0cdc43f	R_HCM_0028	Terminación vs Pago finiquito	TCODE	HIGH	Terminación vs Pago finiquito	\N	t	inst1
2f00a53b-1b2f-4495-8cf3-3d7c7e22b485	R_HCM_0029	Pensiones vs Ajuste pensiones	TCODE	HIGH	Pensiones vs Ajuste pensiones	\N	t	inst1
9401906d-642a-44a8-bd3f-87c1a0666ef5	R_HCM_0030	Médico vs Pago médico	TCODE	HIGH	Médico vs Pago médico	\N	t	inst1
a9cdd1d7-65e4-4bc6-afaa-a0ec57090a74	R_HCM_0031	Subsidios vs Ajuste subsidios	TCODE	HIGH	Subsidios vs Ajuste subsidios	\N	t	inst1
7c5acfb5-ebb2-4051-b86a-4dfce488dd0b	R_HCM_0032	Horas extra vs Autorizar OT	TCODE	HIGH	Horas extra vs Autorizar OT	\N	t	inst1
127f5428-c595-4e20-8b55-75f34ea2a12c	R_HCM_0034	Deducciones vs Exención deducciones	TCODE	HIGH	Deducciones vs Exención deducciones	\N	t	inst1
42524b45-6540-4a7e-8bb3-8f82a3ad18d0	R_HCM_0035	Cálculo bruto vs Neto	TCODE	HIGH	Cálculo bruto vs Neto	\N	t	inst1
d03ab5bb-47bd-43c0-b71b-fce9ce2005f7	R_HCM_0036	Reportar vs Ajustar resultados	TCODE	HIGH	Reportar vs Ajustar resultados	\N	t	inst1
6501cee7-e581-4c2e-ba26-cf624055fcfd	R_HCM_0037	Auditar vs Corregir hallazgos	TCODE	HIGH	Auditar vs Corregir hallazgos	\N	t	inst1
fcc6e0ae-5511-48ac-80b5-1fbb41ed0a5f	R_HCM_0038	Maestro vs Procesar	TCODE	HIGH	Maestro vs Procesar	\N	t	inst1
ca3ef7fb-91b5-4087-96c5-6d086c7c3b13	R_HCM_0039	Configurar vs Operar	TCODE	HIGH	Configurar vs Operar	\N	t	inst1
f30a3799-5f65-452b-92d2-aeb1e99172d6	R_HCM_0040	Verificar vs Ejecutar	TCODE	HIGH	Verificar vs Ejecutar	\N	t	inst1
a94d7a86-3f40-4a2e-b3bb-9d8f5935c519	R_HCM_0042	Aprobar vs Iniciar	TCODE	HIGH	Aprobar vs Iniciar	\N	t	inst1
6cff4ad2-f546-481b-9206-fbefa2303095	R_HCM_0043	Crear/modificar datos y corregir nómina	TCODE	HIGH	Crear/modificar datos y corregir nómina	\N	t	inst1
e4fc33e9-eb88-49e7-aabf-524c0f704a49	R_HCM_0044	Terminar empleado y pagar liquidación	TCODE	HIGH	Terminar empleado y pagar liquidación	\N	t	inst1
b3b25190-3fbd-416d-a15c-652dce4acc87	R_HCM_0045	Asignar beneficios y descontar	TCODE	HIGH	Asignar beneficios y descontar	\N	t	inst1
9edebf6c-6b19-4931-bfbf-883c7707ef2f	R_HCM_0046	Crear puesto y asignar organización	TCODE	HIGH	Crear puesto y asignar organización	\N	t	inst1
9d5d75ab-ba1e-4a61-a73c-dee8471f9dc9	R_HCM_0047	Preparar y autorizar nómina	TCODE	HIGH	Preparar y autorizar nómina	\N	t	inst1
6ee944a9-1fa5-4152-97ed-4fa9dcb59890	R_HCM_0048	Ejecutar y validar cálculo	TCODE	HIGH	Ejecutar y validar cálculo	\N	t	inst1
684c5384-68fb-4ec2-9121-ae5ddc3e97f2	R_HCM_0049	Procesar y autorizar pago	TCODE	HIGH	Procesar y autorizar pago	\N	t	inst1
489f4632-4be1-4a62-8080-1ac32ca900a6	R_HCM_0050	Procesar retro y corregir	TCODE	HIGH	Procesar retro y corregir	\N	t	inst1
a5b50657-7b40-4aae-bdaf-f7ce299ce508	R_HCM_0051	Iniciar y autorizar proceso	TCODE	HIGH	Iniciar y autorizar proceso	\N	t	inst1
9bdf17ac-d794-4ccb-b7ae-f0edec63b993	R_HCM_0052	Solicitar y autorizar pago	TCODE	HIGH	Solicitar y autorizar pago	\N	t	inst1
89a7a2ac-b36f-4db2-ab9e-9fb0aee41007	R_HCM_0053	Crear y aprobar documentos	TCODE	HIGH	Crear y aprobar documentos	\N	t	inst1
d8f4fa5c-a5dc-4a59-b6eb-1c9de6ca2dd4	R_HCM_0054	Configurar sistema y operar	TCODE	HIGH	Configurar sistema y operar	\N	t	inst1
c31775b9-d9e1-4732-bfe9-e79b74cfbada	R_HCM_0055	Definir parámetros y ejecutar	TCODE	HIGH	Definir parámetros y ejecutar	\N	t	inst1
162ddc85-d7a2-4961-8df0-de3e96ec8d45	R_HCM_0056	Personalizar y ejecutar procesos	TCODE	HIGH	Personalizar y ejecutar procesos	\N	t	inst1
318f2cac-aac6-473e-b368-7e2e25e07f01	R_HCM_0057	Identificar errores y corregirlos	TCODE	HIGH	Identificar errores y corregirlos	\N	t	inst1
46cb17b4-ffe2-41c4-b1c0-1c4362fde5b4	R_HCM_0058	Supervisar y realizar ajustes	TCODE	HIGH	Supervisar y realizar ajustes	\N	t	inst1
0813e87d-eb14-42d5-bb95-ef5211c4b61a	R_HCM_0041	Monitor vs Modify	TCODE	HIGH	Monitorear vs Modificar	\N	t	inst1
01202f3c-6f57-49b6-a1a5-07b40c0e420e	R_HCM_0059	Issue Reporting and Remediation	TCODE	HIGH	Reportar problemas y reparar	\N	t	inst1
49cb2d48-261e-4584-b06b-e64149b2f692	R_HCM_0122	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
1c1cae2b-17a2-46fa-9f87-db3c56e6b8fd	R_HCM_0123	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
2e180b33-6232-4d69-aee0-7fd9531a88db	R_HCM_0124	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
9ed28259-8320-40a0-a005-09e7ee232033	R_HCM_0125	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
70781d0f-2046-4d7e-b77c-600f86d56aa2	R_HCM_0126	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
8240829b-399c-4c89-9651-2a7969c994fc	R_HCM_0127	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
5da24ffc-e261-43de-bc0a-dbf77a7d91ad	R_HCM_0128	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
1f6bf039-8d23-4e96-8546-77590a5f4974	R_HCM_0129	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
b4655884-ce30-40d3-b9b2-12c322d9da48	R_HCM_0130	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
0d419bcd-9261-400b-917b-b8da4a34fdcc	R_HCM_0131	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
122f0838-6b2c-45ed-a3fe-882edbc0cf32	R_HCM_0132	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
9e459bf8-7a4b-4990-a9b6-c0d1d8a7d9eb	R_HCM_0133	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
8e12b7a6-fe85-46b5-8ad8-955831ef905e	R_HCM_0134	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
70c65733-e86c-46ad-b33b-f8d292c47ffa	R_HCM_0135	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
159dc4e8-1601-4cc2-9876-e835f3bbf328	R_HCM_0136	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
21303f2f-8cad-4dac-bc0d-6f727c64a04f	R_HCM_0137	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
e794babc-f05b-4851-9e28-915e34eae328	R_HCM_0138	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
1213a3c8-b83b-4554-9d81-f23500b6ee91	R_HCM_0139	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
bb1584fb-5b2f-43f0-bf4e-376538427e50	R_HCM_0140	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
06f413c2-da61-47da-9316-aa1cc3b697ff	R_HCM_0141	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
dac4a515-67eb-496d-b0cd-8990ad675656	R_HCM_0142	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
3181d596-8adc-420c-b9c7-ae18eb664c13	R_HCM_0143	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
3885fc36-ac0e-4aec-8a92-0018f3346006	R_HCM_0144	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
3d4d3432-4e1e-4705-8938-21f7b70d37d3	R_HCM_0145	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
2f945493-01c8-4ff3-891d-7ed31480e2d7	R_HCM_0146	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
4d027d2a-d58e-4c2f-912c-5858158ab395	R_HCM_0147	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
b0ea7c69-fbce-4013-ac95-555245ec288b	R_HCM_0148	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
b2beb13b-9488-4946-9102-5e554144ac77	R_HCM_0149	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
4f13e38b-468f-4c65-8072-b7d4f6ed485e	R_HCM_0150	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
f4074ee6-5ecf-46e4-8444-5cadb8c67fc0	R_HCM_0151	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
0a11088b-8f00-49b9-9e1c-e5500503cf2e	R_HCM_0152	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
4dd42789-2f7f-4929-b27e-f25b64c255ca	R_HCM_0153	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
8ad388ae-5037-4e65-af5b-14c2e5137ed6	R_HCM_0154	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
db33dcc6-431c-4261-bd45-2c366f95a2b9	R_HCM_0155	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
3e12082d-af50-4e7a-b5ad-590939c33fdb	R_HCM_0156	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
6456ec06-2388-4e94-8159-7d062114fe8b	R_HCM_0157	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
cc103919-1b46-48ad-9c47-8337af79aa62	R_HCM_0158	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
57e4769f-463b-413f-a474-b4e2850c83ea	R_HCM_0159	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
958ac12b-19c7-486b-9b0d-b254e0aaef63	R_HCM_0160	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
484980de-662d-4bf4-90ed-531ef09e2504	R_HCM_0161	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
9c615f43-ece0-49ad-aadd-399c03d2bdf4	R_HCM_0162	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
af8e8dc4-f371-4368-b578-e94be4d5b60b	R_HCM_0163	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
759e0c94-90ab-4489-8b2b-87af725925b1	R_HCM_0164	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
f94282b6-5e00-4498-81f9-f6be6c3a59cf	R_HCM_0165	V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
27ae9fae-6029-4a48-9f59-5c9bd331c6c2	R_HCM_0166	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
2b199fd3-4a2f-4742-b354-21fbbd7c4add	R_HCM_0229	Batch Input Session Processing - Todas transacciones operativas - Logs con revisión diaria	TCODE	MEDIUM	Batch Input Session Processing - Todas transacciones operativas - Logs con revisión diaria	\N	t	inst1
2e62fe65-a636-4a89-aa25-6ef25381dbda	R_HCM_0230	Batch Input Session Processing - Todas transacciones operativas - Logs con revisión diaria	TCODE	MEDIUM	Batch Input Session Processing - Todas transacciones operativas - Logs con revisión diaria	\N	t	inst1
41dafec4-bef8-4261-9669-0b88f678d2e4	R_HCM_0198	Role Maintenance - Operational Transactions - Quarterly Review	TCODE	MEDIUM	Mantencion de Roles - Transacciones operativas - Revisión trimestral	\N	t	inst1
896ce5cf-d72b-402b-ac8b-e54a7be9421f	R_HCM_0231	Batch Input Session Processing - Todas transacciones operativas - Logs con revisión diaria	TCODE	MEDIUM	Batch Input Session Processing - Todas transacciones operativas - Logs con revisión diaria	\N	t	inst1
d3dd9b16-ac98-4307-96ee-523bbb950c74	R_HCM_0232	Batch Input Session Management - Cualquier transacción de modificación - Restricción por IP	TCODE	MEDIUM	Batch Input Session Management - Cualquier transacción de modificación - Restricción por IP	\N	t	inst1
af6a4945-acc2-4cac-a81c-33ba1f176484	R_HCM_0233	Batch Input Session Management - Cualquier transacción de modificación - Restricción por IP	TCODE	MEDIUM	Batch Input Session Management - Cualquier transacción de modificación - Restricción por IP	\N	t	inst1
752717dc-4e0d-4eb8-8347-7100cd7f1d91	R_HCM_0234	Batch Input Session Management - Cualquier transacción de modificación - Restricción por IP	TCODE	MEDIUM	Batch Input Session Management - Cualquier transacción de modificación - Restricción por IP	\N	t	inst1
aa436357-e18a-4a3f-bffc-09fe888424fa	R_HCM_0235	User Maintenance - Transacciones de proceso - Aprobación por comité	TCODE	MEDIUM	User Maintenance - Transacciones de proceso - Aprobación por comité	\N	t	inst1
95e96c74-641a-440c-bc0f-ddf78d284bc2	R_HCM_0236	User Maintenance - Transacciones de proceso - Aprobación por comité	TCODE	MEDIUM	User Maintenance - Transacciones de proceso - Aprobación por comité	\N	t	inst1
8592d5f5-6997-4f74-85c3-5bd682f6a04f	R_HCM_0237	User Maintenance - Transacciones de proceso - Aprobación por comité	TCODE	MEDIUM	User Maintenance - Transacciones de proceso - Aprobación por comité	\N	t	inst1
2baad4a9-d62e-4bb3-bfd1-21bcd33407f0	R_HCM_0241	Table Maintenance - V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	Table Maintenance - V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
24d82acf-a116-44f6-baf2-f8984dc8abbd	R_HCM_0242	Table Maintenance - V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	Table Maintenance - V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
225f6370-4b94-43ec-8202-b783e5e3b791	R_HCM_0243	Table Maintenance - V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	Table Maintenance - V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
e13ba2f0-dea0-46b5-a9ad-d14fa520838a	R_HCM_0244	Table Maintenance - V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	Table Maintenance - V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
1daf9dc7-18e0-4cb0-9ca2-4d16fc60dfa7	R_HCM_0245	Table Maintenance - V_T5* (Tablas HR) - Bloqueo en producción	TCODE	MEDIUM	Table Maintenance - V_T5* (Tablas HR) - Bloqueo en producción	\N	t	inst1
11c40c98-98b3-42f6-ab8c-7faff3d8d988	R_HCM_0246	Data Browser - Tablas PA, PC, PY* - Acceso solo para BASIS	TCODE	MEDIUM	Data Browser - Tablas PA, PC, PY* - Acceso solo para BASIS	\N	t	inst1
0d3dc1e1-b569-4d05-81e5-09d988768f0c	R_HCM_0247	Data Browser - Tablas PA, PC, PY* - Acceso solo para BASIS	TCODE	MEDIUM	Data Browser - Tablas PA, PC, PY* - Acceso solo para BASIS	\N	t	inst1
78684a8d-d267-47e7-9887-963750d19227	R_HCM_0248	Data Browser - Tablas PA, PC, PY* - Acceso solo para BASIS	TCODE	MEDIUM	Data Browser - Tablas PA, PC, PY* - Acceso solo para BASIS	\N	t	inst1
0460e0ff-8d07-4872-9b0b-57446583a188	R_HCM_0249	Data Browser - Tablas PA, PC, PY* - Acceso solo para BASIS	TCODE	MEDIUM	Data Browser - Tablas PA, PC, PY* - Acceso solo para BASIS	\N	t	inst1
eda5aca9-3c4b-42e4-b75d-bc0a1477a212	R_HCM_0250	Data Browser - Tablas PA, PC, PY* - Acceso solo para BASIS	TCODE	MEDIUM	Data Browser - Tablas PA, PC, PY* - Acceso solo para BASIS	\N	t	inst1
e6ef3ed1-bc7a-4db6-afce-1cd2d172d0d7	R_HCM_0251	Mantenimiento Datos Maestros Personal - Transport Management	TCODE	MEDIUM	Mantenimiento Datos Maestros Personal - Transport Management	\N	t	inst1
346d72ad-6ac7-4578-866c-2ab4638f5f73	R_HCM_0252	Personalizar Nómina - Transport Management	TCODE	MEDIUM	Personalizar Nómina - Transport Management	\N	t	inst1
418ff229-b1a0-4b2c-a918-1716bba38c54	R_HCM_0253	Customizing Implementation Guide - System Transport	TCODE	MEDIUM	Customizing Implementation Guide - System Transport	\N	t	inst1
578a9c65-d50d-4d96-ab09-a8886ab5fc27	R_HCM_0254	Configurar Parámetros Nómina - System Transport	TCODE	MEDIUM	Configurar Parámetros Nómina - System Transport	\N	t	inst1
5daeaafb-ee6e-4622-81ea-ce8944c3c78a	R_HCM_0255	Modificación conflictiva de Infotypes clásicos. En ECP, esto crea inconsistencia con los datos de Employee Central.	TCODE	HIGH	Modificación conflictiva de Infotypes clásicos. En ECP, esto crea inconsistencia con los datos de Employee Central.	\N	t	inst1
bef21342-17fa-4ec9-a0ac-10dedddc71d2	R_HCM_0256	Versiones nueva y antigua del simulador de nómina. No deben usarse indistintamente.	TCODE	MEDIUM	Versiones nueva y antigua del simulador de nómina. No deben usarse indistintamente.	\N	t	inst1
9c66a1a6-b62b-4b85-b33c-53de6e5cf835	R_HCM_0257	Versiones nueva y antigua de la "banda de molienda". Su uso concurrente puede corromper el proceso.	TCODE	HIGH	Versiones nueva y antigua de la "banda de molienda". Su uso concurrente puede corromper el proceso.	\N	t	inst1
563bc34a-63c7-423f-b2e6-974c15b2764c	R_HCM_0258	Crear y modificar el mismo objeto de personalización de Infotypes causa bloqueo.	TCODE	HIGH	Crear y modificar el mismo objeto de personalización de Infotypes causa bloqueo.	\N	t	inst1
c4a8a33a-82a0-4bc1-b09b-2a6e14dae39e	R_HCM_0260	Crear y modificar la misma regla de horario causa bloqueo.	TCODE	HIGH	Crear y modificar la misma regla de horario causa bloqueo.	\N	t	inst1
870dd2df-454f-4e19-99d5-144336e07402	R_HCM_0261	Mantenimiento rápido y por período del mismo Infotype para el mismo empleado causa solapamiento de datos.	TCODE	HIGH	Mantenimiento rápido y por período del mismo Infotype para el mismo empleado causa solapamiento de datos.	\N	t	inst1
b403e1d1-cbb9-453b-aa27-baa535aa7066	R_HCM_0262	Mantenimiento rápido y por período de Infotypes de solicitudes para el mismo empleado causa solapamiento.	TCODE	HIGH	Mantenimiento rápido y por período de Infotypes de solicitudes para el mismo empleado causa solapamiento.	\N	t	inst1
087b41c6-33d0-4a76-b3ad-06182782c869	R_HCM_0259	Creating and modifying the same customization object (N versions) causes a lock.	TCODE	HIGH	Crear y modificar el mismo objeto de personalización (versiones N) causa bloqueo.	\N	t	inst1
ec3daa39-8eea-47aa-8065-7ce8323abcfb	R_HCM_0263	Acceso conflictivo a datos maestros: clásico (PA03) vs. arquitectura de Employee Central (PP6A).	TCODE	HIGH	Acceso conflictivo a datos maestros: clásico (PA03) vs. arquitectura de Employee Central (PP6A).	\N	t	inst1
39e5b300-d9a1-458f-b088-afe4199255d8	R_HCM_0265	Mantenimiento y Visualización del mismo Infotype de Employee Central pueden bloquearse entre sí.	TCODE	LOW	Mantenimiento y Visualización del mismo Infotype de Employee Central pueden bloquearse entre sí.	\N	t	inst1
2f6ca006-fe1f-4dc6-9fea-17c085828ca4	R_HCM_0266	Mantenimiento estándar y de inscripción del mismo catálogo puede causar conflictos de datos.	TCODE	MEDIUM	Mantenimiento estándar y de inscripción del mismo catálogo puede causar conflictos de datos.	\N	t	inst1
25d9029b-52c0-4e2c-bc16-088a4cad7d38	R_HCM_0267	Mantenimiento de Perfiles y de Selecciones de Catálogo están vinculados; cambios en uno afectan al otro de forma impredecible.	TCODE	MEDIUM	Mantenimiento de Perfiles y de Selecciones de Catálogo están vinculados; cambios en uno afectan al otro de forma impredecible.	\N	t	inst1
99a435ce-643a-427f-89f4-2ca2645ae72b	R_HCM_0268	Gestionan centros de trabajo/costes de forma diferente (configuración vs. asignación masiva). Pueden solaparse.	TCODE	LOW	Gestionan centros de trabajo/costes de forma diferente (configuración vs. asignación masiva). Pueden solaparse.	\N	t	inst1
e59301e4-377f-4666-b99b-fc060f58cc3e	R_HCM_0269	Retroactivos por Proceso y por Empleado son vistas del mismo proceso; modificar en uno afecta al otro.	TCODE	MEDIUM	Retroactivos por Proceso y por Empleado son vistas del mismo proceso; modificar en uno afecta al otro.	\N	t	inst1
b9b7c8f1-55e2-4a91-8f26-c01996a26dfe	R_HCM_0264	Evaluation and Maintenance of the same Employee Central Infotype can lock each other.	TCODE	MEDIUM	Evaluación y Mantenimiento del mismo Infotype de Employee Central pueden bloquearse entre sí.	\N	t	inst1
21d0d5c1-6b61-43c1-9b47-ba11b10472c9	R_HCM_0271	Mantenimiento de tabla (vía vista) y visualización/edición directa de la misma tabla pueden bloquearse.	TCODE	MEDIUM	Mantenimiento de tabla (vía vista) y visualización/edición directa de la misma tabla pueden bloquearse.	\N	t	inst1
3351abb4-ed2d-4c68-9ef3-92310c4974f7	R_HCM_0272	Reports específicos muy similares; ejecutar ambos para la misma data puede causar bloqueos y es redundante.	TCODE	LOW	Reports específicos muy similares; ejecutar ambos para la misma data puede causar bloqueos y es redundante.	\N	t	inst1
3dca6a38-6a82-4788-9812-16237bdd6207	R_HCM_0274	AL11 es una utilidad del servidor. Su uso incorrecto puede afectar el rendimiento de las transacciones de aplicación.	TCODE	HIGH	AL11 es una utilidad del servidor. Su uso incorrecto puede afectar el rendimiento de las transacciones de aplicación.	\N	t	inst1
445c8cae-688b-42bc-8673-ec4f8cca735c	R_HCM_0275	Pueden estar gestionando el mismo evento de workflow de nómina de forma conflictiva.	TCODE	MEDIUM	Pueden estar gestionando el mismo evento de workflow de nómina de forma conflictiva.	\N	t	inst1
7089652c-2dce-488c-9d4b-27d77416bf77	R_HCM_0276	Reports de compensación sucesivos; ejecutar la simulación (0081) sin un análisis previo (0080) puede llevar a errores.	TCODE	MEDIUM	Reports de compensación sucesivos; ejecutar la simulación (0081) sin un análisis previo (0080) puede llevar a errores.	\N	t	inst1
2d641d82-2a5e-41b1-9426-b80e3683778a	R_HCM_0277	OH11 (Esquemas de cálculo clásicos) es incompatible con la configuración de nómina ECP (CIPE01).	TCODE	HIGH	OH11 (Esquemas de cálculo clásicos) es incompatible con la configuración de nómina ECP (CIPE01).	\N	t	inst1
9112f0fc-03b7-4002-af48-793633f951af	R_HCM_0278	LSMW (Carga masiva genérica) no debe usarse para modificar datos directamente en tablas de Employee Central gestionadas por PP6B.	TCODE	HIGH	LSMW (Carga masiva genérica) no debe usarse para modificar datos directamente en tablas de Employee Central gestionadas por PP6B.	\N	t	inst1
83c6eff5-0959-4b1f-9a22-7bdaed1e4381	R_HCM_0279	Ambas gestionan datos de cumpleaños/imputación; modificar ambas simultáneamente puede causar inconsistencia.	TCODE	HIGH	Ambas gestionan datos de cumpleaños/imputación; modificar ambas simultáneamente puede causar inconsistencia.	\N	t	inst1
c99c821e-8721-419e-bfa6-8d489efa1828	R_HCM_0280	PU03 (Actualización de herramientas HCM) y SM31 (Mantenimiento de tabla) sobre la misma tabla personalizada pueden causar conflictos.	TCODE	HIGH	PU03 (Actualización de herramientas HCM) y SM31 (Mantenimiento de tabla) sobre la misma tabla personalizada pueden causar conflictos.	\N	t	inst1
78ea0de9-b390-4d5c-829a-a7e860de16e5	R_HCM_0281	PP02 (Mantenimiento de tablas de PD) y PPME (Menú de personalización) pueden acceder a los mismos objetos de customizing.	TCODE	MEDIUM	PP02 (Mantenimiento de tablas de PD) y PPME (Menú de personalización) pueden acceder a los mismos objetos de customizing.	\N	t	inst1
c35cce0f-57ab-40f4-8e5b-e034ec960799	R_HCM_0282	Ambos reportes modifican datos maestros críticos; ejecutarlos concurrentemente puede dañar la integridad de los datos.	TCODE	HIGH	Ambos reportes modifican datos maestros críticos; ejecutarlos concurrentemente puede dañar la integridad de los datos.	\N	t	inst1
388e1981-70d7-42aa-904e-023a6dc99ca5	R_HCM_0283	PO01 (Crear dato maestro clásico) es totalmente incompatible con PP6B (Crear dato maestro en Employee Central).	TCODE	HIGH	PO01 (Crear dato maestro clásico) es totalmente incompatible con PP6B (Crear dato maestro en Employee Central).	\N	t	inst1
020a1a22-8b12-467b-8d86-495d04021c94	R_HCM_0284	PO10 (Asignación clásica de cuenta) es incompatible con la gestión de deducciones ECP (DKON).	TCODE	HIGH	PO10 (Asignación clásica de cuenta) es incompatible con la gestión de deducciones ECP (DKON).	\N	t	inst1
2a22af63-dc1f-4424-aaf9-2072d218d2ce	R_HCM_0285	PE04 (Parámetros de personalización de Infotypes) y PPSC (Configuración de proveedor de servicios) pueden tener dependencias conflictivas.	TCODE	MEDIUM	PE04 (Parámetros de personalización de Infotypes) y PPSC (Configuración de proveedor de servicios) pueden tener dependencias conflictivas.	\N	t	inst1
10daaef1-1417-4a3b-8987-8fec245219dc	R_HCM_0286	PP02 (Mantenimiento de tablas de PD) y PPOMW (Banda de molienda - herramientas) acceden a objetos técnicos similares.	TCODE	MEDIUM	PP02 (Mantenimiento de tablas de PD) y PPOMW (Banda de molienda - herramientas) acceden a objetos técnicos similares.	\N	t	inst1
ee3cd4f5-615f-41b0-8d6a-4459f2be093c	R_HCM_0339	Maintain Time Data |vs.| Approve Time	TCODE	HIGH	Maintain Time Data |vs.| Approve Time	\N	t	inst1
223972a8-7b98-4962-a7b6-2f734ae1b791	R_HCM_0273	Individual and group administration in Time Management can interfere with the same employees.	TCODE	MEDIUM	Administración individual y por grupo de Time Management pueden interferir sobre los mismos empleados.	\N	t	inst1
3b28538a-e4df-4e02-8ff1-05ba904bbdbc	R_HCM_0287	PA71 (Registro de tiempo) y PT50 (Información de tiempo) gestionan datos de tiempo de forma conflictiva en arquitecturas diferentes.	TCODE	HIGH	PA71 (Registro de tiempo) y PT50 (Información de tiempo) gestionan datos de tiempo de forma conflictiva en arquitecturas diferentes.	\N	t	inst1
fed59ca0-f63b-4761-aee2-42e0c9f164a6	R_HCM_0288	PFOM (Formas de pago clásicas) y CWTR (Centros de trabajo ECP) son enfoques diferentes para gestión de pagos.	TCODE	HIGH	PFOM (Formas de pago clásicas) y CWTR (Centros de trabajo ECP) son enfoques diferentes para gestión de pagos.	\N	t	inst1
41f05240-da1e-491f-82b8-a3152546985d	R_HCM_0289	PRMD (Modelo de personalización clásico) es incompatible con las herramientas de implementación ECP (ECP_001).	TCODE	HIGH	PRMD (Modelo de personalización clásico) es incompatible con las herramientas de implementación ECP (ECP_001).	\N	t	inst1
2011c92f-94e6-42e3-82e8-73ef9aa609ea	R_HCM_0290	PU00 (Actualización de HR) y LSMW (Carga masiva) pueden intentar actualizar las mismas estructuras de datos simultáneamente.	TCODE	HIGH	PU00 (Actualización de HR) y LSMW (Carga masiva) pueden intentar actualizar las mismas estructuras de datos simultáneamente.	\N	t	inst1
e176db5a-23ed-4290-a730-930a821bc45f	R_HCM_0291	Modificación conflictiva de Infotypes clásicos. En ECP, esto crea inconsistencia con los datos de Employee Central.	TCODE	HIGH	Modificación conflictiva de Infotypes clásicos. En ECP, esto crea inconsistencia con los datos de Employee Central.	\N	t	inst1
5e582ea5-c980-408b-926e-c3ad36b2a2c8	R_HCM_0300	Evaluation and Maintenance of the same Employee Central Infotype can lock each other.	TCODE	MEDIUM	Evaluación y Mantenimiento del mismo Infotype de Employee Central pueden bloquearse entre sí.	\N	t	inst1
7718bddc-3e08-4e5f-a61f-517ea579471f	R_HCM_0293	Versiones nueva y antigua de la "banda de molienda". Su uso concurrente puede corromper el proceso.	TCODE	HIGH	Versiones nueva y antigua de la "banda de molienda". Su uso concurrente puede corromper el proceso.	\N	t	inst1
a8b70fa3-983a-4cb8-a697-b59b8a4a88f4	R_HCM_0294	Crear y modificar el mismo objeto de personalización de Infotypes causa bloqueo.	TCODE	HIGH	Crear y modificar el mismo objeto de personalización de Infotypes causa bloqueo.	\N	t	inst1
a94ed8a4-2eca-44f9-b6da-12ce07d94339	R_HCM_0295	Crear y modificar el mismo objeto de personalización (versiones N) causa bloqueo.	TCODE	HIGH	Crear y modificar el mismo objeto de personalización (versiones N) causa bloqueo.	\N	t	inst1
f8c692cf-cb36-4134-99f2-642e3a92051f	R_HCM_0296	Crear y modificar la misma regla de horario causa bloqueo.	TCODE	HIGH	Crear y modificar la misma regla de horario causa bloqueo.	\N	t	inst1
bcae2fc8-d0fa-4642-aca0-41dbb8975bff	R_HCM_0297	Mantenimiento rápido y por período del mismo Infotype para el mismo empleado causa solapamiento de datos.	TCODE	HIGH	Mantenimiento rápido y por período del mismo Infotype para el mismo empleado causa solapamiento de datos.	\N	t	inst1
bf96f32f-e831-489d-9cac-0617b4af89b8	R_HCM_0298	Mantenimiento rápido y por período de Infotypes de solicitudes para el mismo empleado causa solapamiento.	TCODE	HIGH	Mantenimiento rápido y por período de Infotypes de solicitudes para el mismo empleado causa solapamiento.	\N	t	inst1
7f440683-73ac-464d-beeb-d30ef2802f10	R_HCM_0299	Acceso conflictivo a datos maestros: clásico (PA03) vs. arquitectura de Employee Central (PP6A).	TCODE	HIGH	Acceso conflictivo a datos maestros: clásico (PA03) vs. arquitectura de Employee Central (PP6A).	\N	t	inst1
a3c8a0dc-1e74-4673-ac7c-acd453942411	R_HCM_0301	Mantenimiento y Visualización del mismo Infotype de Employee Central pueden bloquearse entre sí.	TCODE	LOW	Mantenimiento y Visualización del mismo Infotype de Employee Central pueden bloquearse entre sí.	\N	t	inst1
3d2c1cb0-dc58-4cb4-9dce-b2c39d251f20	R_HCM_0302	Mantenimiento estándar y de inscripción del mismo catálogo puede causar conflictos de datos.	TCODE	MEDIUM	Mantenimiento estándar y de inscripción del mismo catálogo puede causar conflictos de datos.	\N	t	inst1
2f057a26-6581-45f0-ad25-637ac74ffe29	R_HCM_0303	Mantenimiento de Perfiles y de Selecciones de Catálogo están vinculados; cambios en uno afectan al otro de forma impredecible.	TCODE	MEDIUM	Mantenimiento de Perfiles y de Selecciones de Catálogo están vinculados; cambios en uno afectan al otro de forma impredecible.	\N	t	inst1
498da3a8-e68d-4f54-9d92-ceff56fc2faa	R_HCM_0304	Gestionan centros de trabajo/costes de forma diferente (configuración vs. asignación masiva). Pueden solaparse.	TCODE	LOW	Gestionan centros de trabajo/costes de forma diferente (configuración vs. asignación masiva). Pueden solaparse.	\N	t	inst1
f6d22e6e-8ec7-4a7a-823c-b084e8b7a686	R_HCM_0305	Retroactivos por Proceso y por Empleado son vistas del mismo proceso; modificar en uno afecta al otro.	TCODE	MEDIUM	Retroactivos por Proceso y por Empleado son vistas del mismo proceso; modificar en uno afecta al otro.	\N	t	inst1
c777acbe-4826-49b6-ab3c-b575a245cf50	R_HCM_0306	Procesos de fin de contrato (Liquidación y Amortización) no deben ejecutarse en paralelo para el mismo empleado.	TCODE	HIGH	Procesos de fin de contrato (Liquidación y Amortización) no deben ejecutarse en paralelo para el mismo empleado.	\N	t	inst1
695cd62e-4c74-4a7e-aabb-97d9c8573bc4	R_HCM_0307	Mantenimiento de tabla (vía vista) y visualización/edición directa de la misma tabla pueden bloquearse.	TCODE	MEDIUM	Mantenimiento de tabla (vía vista) y visualización/edición directa de la misma tabla pueden bloquearse.	\N	t	inst1
1cd5baef-ccf6-4dd7-8fdb-b12bea0fa478	R_HCM_0308	Reports específicos muy similares; ejecutar ambos para la misma data puede causar bloqueos y es redundante.	TCODE	LOW	Reports específicos muy similares; ejecutar ambos para la misma data puede causar bloqueos y es redundante.	\N	t	inst1
32c039d2-7d4e-4275-a3de-bac5c4727f40	R_HCM_0310	AL11 es una utilidad del servidor. Su uso incorrecto puede afectar el rendimiento de las transacciones de aplicación.	TCODE	HIGH	AL11 es una utilidad del servidor. Su uso incorrecto puede afectar el rendimiento de las transacciones de aplicación.	\N	t	inst1
3225afe6-136e-467b-b1e9-fed755fdff75	R_HCM_0311	Pueden estar gestionando el mismo evento de workflow de nómina de forma conflictiva.	TCODE	MEDIUM	Pueden estar gestionando el mismo evento de workflow de nómina de forma conflictiva.	\N	t	inst1
38a93ed3-6292-4b1a-a9d7-629fa6350d4f	R_HCM_0340	Maintain Time Data |vs.| Approve Time	TCODE	HIGH	Maintain Time Data |vs.| Approve Time	\N	t	inst1
b8d80755-b0b2-4ebd-bbc0-4628d64e06f1	R_HCM_0309	Individual and group administration in Time Management can interfere with the same employees.	TCODE	MEDIUM	Administración individual y por grupo de Time Management pueden interferir sobre los mismos empleados.	\N	t	inst1
daffdb0a-f9a3-4351-9c3a-ddaa912bddd0	R_HCM_0312	Reports de compensación sucesivos; ejecutar la simulación (0081) sin un análisis previo (0080) puede llevar a errores.	TCODE	MEDIUM	Reports de compensación sucesivos; ejecutar la simulación (0081) sin un análisis previo (0080) puede llevar a errores.	\N	t	inst1
493e94f3-4710-4299-8829-6bd5874ddf55	R_HCM_0313	OH11 (Esquemas de cálculo clásicos) es incompatible con la configuración de nómina ECP (CIPE01).	TCODE	HIGH	OH11 (Esquemas de cálculo clásicos) es incompatible con la configuración de nómina ECP (CIPE01).	\N	t	inst1
4d9476b0-5bee-42cb-84e4-6385dc7f7b49	R_HCM_0314	LSMW (Carga masiva genérica) no debe usarse para modificar datos directamente en tablas de Employee Central gestionadas por PP6B.	TCODE	HIGH	LSMW (Carga masiva genérica) no debe usarse para modificar datos directamente en tablas de Employee Central gestionadas por PP6B.	\N	t	inst1
18c24e1d-7ceb-44f1-97b7-dc223ab4fb7c	R_HCM_0315	Ambas gestionan datos de cumpleaños/imputación; modificar ambas simultáneamente puede causar inconsistencia.	TCODE	HIGH	Ambas gestionan datos de cumpleaños/imputación; modificar ambas simultáneamente puede causar inconsistencia.	\N	t	inst1
97ab3b01-4c8e-4d9e-bc0b-3cedad5a10de	R_HCM_0316	PU03 (Actualización de herramientas HCM) y SM31 (Mantenimiento de tabla) sobre la misma tabla personalizada pueden causar conflictos.	TCODE	HIGH	PU03 (Actualización de herramientas HCM) y SM31 (Mantenimiento de tabla) sobre la misma tabla personalizada pueden causar conflictos.	\N	t	inst1
ad2d6041-9b3b-4b30-a9e0-192eb3994aea	R_HCM_0317	PP02 (Mantenimiento de tablas de PD) y PPME (Menú de personalización) pueden acceder a los mismos objetos de customizing.	TCODE	MEDIUM	PP02 (Mantenimiento de tablas de PD) y PPME (Menú de personalización) pueden acceder a los mismos objetos de customizing.	\N	t	inst1
e33ac8c0-6272-48f3-89f7-5455f3f9504e	R_HCM_0318	Ambos reportes modifican datos maestros críticos; ejecutarlos concurrentemente puede dañar la integridad de los datos.	TCODE	HIGH	Ambos reportes modifican datos maestros críticos; ejecutarlos concurrentemente puede dañar la integridad de los datos.	\N	t	inst1
33716786-f574-4030-8ee7-34f6b2ff6b76	R_HCM_0319	PO01 (Crear dato maestro clásico) es totalmente incompatible con PP6B (Crear dato maestro en Employee Central).	TCODE	HIGH	PO01 (Crear dato maestro clásico) es totalmente incompatible con PP6B (Crear dato maestro en Employee Central).	\N	t	inst1
e5fb6364-3b8a-4d22-bb07-400bb74a8479	R_HCM_0320	PO10 (Asignación clásica de cuenta) es incompatible con la gestión de deducciones ECP (DKON).	TCODE	HIGH	PO10 (Asignación clásica de cuenta) es incompatible con la gestión de deducciones ECP (DKON).	\N	t	inst1
19d8bed7-18fc-4426-8241-5a02cc391bea	R_HCM_0321	PE04 (Parámetros de personalización de Infotypes) y PPSC (Configuración de proveedor de servicios) pueden tener dependencias conflictivas.	TCODE	MEDIUM	PE04 (Parámetros de personalización de Infotypes) y PPSC (Configuración de proveedor de servicios) pueden tener dependencias conflictivas.	\N	t	inst1
056c3fd0-ccad-4e3f-b3f2-bb526422a02e	R_HCM_0322	PP02 (Mantenimiento de tablas de PD) y PPOMW (Banda de molienda - herramientas) acceden a objetos técnicos similares.	TCODE	MEDIUM	PP02 (Mantenimiento de tablas de PD) y PPOMW (Banda de molienda - herramientas) acceden a objetos técnicos similares.	\N	t	inst1
438ec033-eba8-4ada-bf84-57a994ad5563	R_HCM_0323	PA71 (Registro de tiempo) y PT50 (Información de tiempo) gestionan datos de tiempo de forma conflictiva en arquitecturas diferentes.	TCODE	HIGH	PA71 (Registro de tiempo) y PT50 (Información de tiempo) gestionan datos de tiempo de forma conflictiva en arquitecturas diferentes.	\N	t	inst1
18544c3f-262f-4fe9-87d6-4161e9f6a85b	R_HCM_0324	PFOM (Formas de pago clásicas) y CWTR (Centros de trabajo ECP) son enfoques diferentes para gestión de pagos.	TCODE	HIGH	PFOM (Formas de pago clásicas) y CWTR (Centros de trabajo ECP) son enfoques diferentes para gestión de pagos.	\N	t	inst1
42cd2925-a277-4475-a2b7-9f8da9bf0e4b	R_HCM_0325	PRMD (Modelo de personalización clásico) es incompatible con las herramientas de implementación ECP (ECP_001).	TCODE	HIGH	PRMD (Modelo de personalización clásico) es incompatible con las herramientas de implementación ECP (ECP_001).	\N	t	inst1
937d22b4-059c-48ce-9816-40a4edda17f4	R_HCM_0326	PU00 (Actualización de HR) y LSMW (Carga masiva) pueden intentar actualizar las mismas estructuras de datos simultáneamente.	TCODE	HIGH	PU00 (Actualización de HR) y LSMW (Carga masiva) pueden intentar actualizar las mismas estructuras de datos simultáneamente.	\N	t	inst1
6c154390-ee53-4390-b149-72bb19438c29	R_HCM_0327	Maintain Employee Master Data - 0008 - 0009 (Basic Pay & Bank) |vs.| Process Payroll	TCODE	HIGH	Maintain Employee Master Data - 0008 - 0009 (Basic Pay & Bank) |vs.| Process Payroll	\N	t	inst1
2914e164-c272-4f6a-a06d-6a9d16b16ec3	R_HCM_0328	Maintain Employee Master Data - 0008 - 0009 (Basic Pay & Bank) |vs.| Process Payroll	TCODE	HIGH	Maintain Employee Master Data - 0008 - 0009 (Basic Pay & Bank) |vs.| Process Payroll	\N	t	inst1
01f0034e-99c8-400e-a637-a1025b746a64	R_HCM_0329	Maintain Employee Master Data - 0008 - 0009 (Basic Pay & Bank) |vs.| Process Payroll	TCODE	HIGH	Maintain Employee Master Data - 0008 - 0009 (Basic Pay & Bank) |vs.| Process Payroll	\N	t	inst1
e897a5c4-7690-4ba9-811e-929a165e689b	R_HCM_0330	Maintain Employee Master Data - 0008 - 0009 (Basic Pay & Bank) |vs.| Process Payroll	TCODE	HIGH	Maintain Employee Master Data - 0008 - 0009 (Basic Pay & Bank) |vs.| Process Payroll	\N	t	inst1
b04ae505-9ff1-4d1b-9a4f-35b0bfdf8b11	R_HCM_0331	Maintain Employee Master Data - 0008 - 0009 (Basic Pay & Bank) |vs.| Process Payroll	TCODE	HIGH	Maintain Employee Master Data - 0008 - 0009 (Basic Pay & Bank) |vs.| Process Payroll	\N	t	inst1
fc839134-b992-4adb-b698-1702be0ce15f	R_HCM_0332	Maintain Employee Master Data - 0008 - 0009 (Basic Pay & Bank) |vs.| Process Payroll	TCODE	HIGH	Maintain Employee Master Data - 0008 - 0009 (Basic Pay & Bank) |vs.| Process Payroll	\N	t	inst1
a3fda470-f233-455f-835f-b4ab6b6e357e	R_HCM_0333	Maintain Employee Master Data - 0008 - 0009 (Basic Pay & Bank) |vs.| Process Payroll	TCODE	HIGH	Maintain Employee Master Data - 0008 - 0009 (Basic Pay & Bank) |vs.| Process Payroll	\N	t	inst1
182cbb7e-10b5-4df4-a964-7492262e504e	R_HCM_0334	Maintain Employee Master Data - 0008 - 0009 (Basic Pay & Bank) |vs.| Process Payroll	TCODE	HIGH	Maintain Employee Master Data - 0008 - 0009 (Basic Pay & Bank) |vs.| Process Payroll	\N	t	inst1
076169df-2e9d-42d1-a114-4863f31510b0	R_HCM_0335	Maintain Time Data |vs.| Approve Time	TCODE	HIGH	Maintain Time Data |vs.| Approve Time	\N	t	inst1
cb132203-112c-4ab5-aa5c-6011c1adc700	R_HCM_0336	Maintain Time Data |vs.| Approve Time	TCODE	HIGH	Maintain Time Data |vs.| Approve Time	\N	t	inst1
89cab0d7-78cf-47fc-bc1e-03a5f1d70eed	R_HCM_0337	Maintain Time Data |vs.| Approve Time	TCODE	HIGH	Maintain Time Data |vs.| Approve Time	\N	t	inst1
ab259791-f4e8-4b32-a859-1fdd9ea90a90	R_HCM_0338	Maintain Time Data |vs.| Approve Time	TCODE	HIGH	Maintain Time Data |vs.| Approve Time	\N	t	inst1
b89e1f1c-8eff-46d1-af40-0ccdf9724bf8	R_HCM_0341	Maintain Time Data |vs.| Approve Time	TCODE	HIGH	Maintain Time Data |vs.| Approve Time	\N	t	inst1
25435677-995e-4559-91ea-5f43d0221e45	R_HCM_0342	Maintain Time Data |vs.| Approve Time	TCODE	HIGH	Maintain Time Data |vs.| Approve Time	\N	t	inst1
eed23a54-2b28-4162-a0e9-d9f6270181c1	R_HCM_0343	Maintain Time Data |vs.| Approve Time	TCODE	HIGH	Maintain Time Data |vs.| Approve Time	\N	t	inst1
da8d78ce-56fe-4925-ab27-4ded6afc029e	R_HCM_0344	Maintain Time Data |vs.| Approve Time	TCODE	HIGH	Maintain Time Data |vs.| Approve Time	\N	t	inst1
6d6edbb7-a8fe-4531-9049-d36d7e9d46d8	R_HCM_0345	Maintain Time Data |vs.| Approve Time	TCODE	HIGH	Maintain Time Data |vs.| Approve Time	\N	t	inst1
c1a22f6b-df5b-4a32-88ad-74d302e44b03	R_HCM_0346	Maintain Time Data |vs.| Approve Time	TCODE	HIGH	Maintain Time Data |vs.| Approve Time	\N	t	inst1
cb8541a2-b5af-4219-92ed-d7ce1696467d	R_HCM_0347	Maintain Time Data |vs.| Approve Time	TCODE	HIGH	Maintain Time Data |vs.| Approve Time	\N	t	inst1
95be27d3-9d23-4a7e-8a4b-dd236920c85f	R_HCM_0348	Maintain Time Data |vs.| Approve Time	TCODE	HIGH	Maintain Time Data |vs.| Approve Time	\N	t	inst1
11fb2cd6-6106-4fb1-9968-1fcfcfdb0a96	R_HCM_0349	Maintain Time Data |vs.| Approve Time	TCODE	HIGH	Maintain Time Data |vs.| Approve Time	\N	t	inst1
ad46e086-dde8-4b9c-ae8d-0461f61e9058	R_HCM_0350	Maintain Time Data |vs.| Approve Time	TCODE	HIGH	Maintain Time Data |vs.| Approve Time	\N	t	inst1
a7393127-75b2-42f5-88b8-05178bf85b49	R_HCM_0351	Maintain Time Data |vs.| Approve Time	TCODE	HIGH	Maintain Time Data |vs.| Approve Time	\N	t	inst1
e8658153-a0b5-4fd2-a1df-e02c7b17f6ea	R_HCM_0352	Maintain Time Data |vs.| Approve Time	TCODE	HIGH	Maintain Time Data |vs.| Approve Time	\N	t	inst1
170fd75b-c68c-4491-883f-baad4ba71651	R_HCM_0353	Maintain Payroll Configuration |vs.| Process Payroll	TCODE	HIGH	Maintain Payroll Configuration |vs.| Process Payroll	\N	t	inst1
af6baa02-e8ae-4a89-a568-8bba0eac79d2	R_HCM_0354	Maintain Payroll Configuration |vs.| Process Payroll	TCODE	HIGH	Maintain Payroll Configuration |vs.| Process Payroll	\N	t	inst1
d2e06c2d-9c81-477d-ad70-d7df15492367	R_HCM_0355	Maintain Payroll Configuration |vs.| Process Payroll	TCODE	HIGH	Maintain Payroll Configuration |vs.| Process Payroll	\N	t	inst1
84a8db24-5331-4481-be6f-9d075e710360	R_HCM_0356	Maintain Payroll Configuration |vs.| Process Payroll	TCODE	HIGH	Maintain Payroll Configuration |vs.| Process Payroll	\N	t	inst1
5033e2c2-01c9-4aaa-a52b-7a48600a8ef3	R_HCM_0357	Maintain Employee Master Data - 0008 - 0009 (Basic Pay & Bank) |vs.| Maintain Payroll Configuration	TCODE	HIGH	Maintain Employee Master Data - 0008 - 0009 (Basic Pay & Bank) |vs.| Maintain Payroll Configuration	\N	t	inst1
99dc760b-b79f-4896-a96d-74664ce7db08	R_HCM_0358	Maintain Employee Master Data - 0008 - 0009 (Basic Pay & Bank) |vs.| Maintain Payroll Configuration	TCODE	HIGH	Maintain Employee Master Data - 0008 - 0009 (Basic Pay & Bank) |vs.| Maintain Payroll Configuration	\N	t	inst1
69737c57-c45d-4fcc-9133-3a83e96fa0e4	R_HCM_0359	Payroll Maintenance |vs.| Process Payroll	TCODE	HIGH	Payroll Maintenance |vs.| Process Payroll	\N	t	inst1
dcad4a0c-10ba-464c-ba2d-3617288ebb0b	R_HCM_0360	Payroll Maintenance |vs.| Process Payroll	TCODE	HIGH	Payroll Maintenance |vs.| Process Payroll	\N	t	inst1
148cadf6-f828-4cda-8a6e-10dda076d07e	R_HCM_0361	Payroll Maintenance |vs.| Process Payroll	TCODE	HIGH	Payroll Maintenance |vs.| Process Payroll	\N	t	inst1
b466cef9-65b6-437c-85ad-1bc32d18d9fc	R_HCM_0362	Payroll Maintenance |vs.| Process Payroll	TCODE	HIGH	Payroll Maintenance |vs.| Process Payroll	\N	t	inst1
023fa54a-6a3d-4a79-8899-9346e07de620	R_HCM_0363	Payroll Maintenance |vs.| Process Payroll	TCODE	HIGH	Payroll Maintenance |vs.| Process Payroll	\N	t	inst1
477110cd-bdd1-42a4-ace9-1455a31a54d6	R_HCM_0364	Payroll Maintenance |vs.| Process Payroll	TCODE	HIGH	Payroll Maintenance |vs.| Process Payroll	\N	t	inst1
d0f9d198-7a30-4993-ba21-806bdb411fd5	R_HCM_0365	Payroll Maintenance |vs.| Process Payroll	TCODE	HIGH	Payroll Maintenance |vs.| Process Payroll	\N	t	inst1
\.


--
-- Data for Name: GrcRole; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."GrcRole" (id_role, role_name, role_desc, process_area, criticality, status, "institutionId", created_at) FROM stdin;
004380b8-4e60-4742-9c2b-631c8db7f562	Z_MM_OC	Creación de orden de compra	MM	MEDIUM	t	inst1	2026-05-08 20:02:26.253
07e45bc3-972a-4fad-94f7-87c48f40ae14	Z_FI_APROB	Aprobación de pagos FI	FI	HIGH	t	inst1	2026-05-08 20:02:26.211
8a25c070-0740-467d-8587-c3d3887176c1	Z_FI_PAGO	Ejecución de pagos FI	FI	HIGH	t	inst1	2026-05-08 20:02:26.217
1e3576f2-d340-4cad-b427-55b54dc0b4f6	Z_HCM_MAESTRO	Mantención de data maestros HCM	HCM	HIGH	t	inst1	2026-05-08 20:02:26.258
\.


--
-- Data for Name: GrcRoleTrx; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."GrcRoleTrx" (id_role_trx, role_name, transaction, "institutionId", created_at, field, object) FROM stdin;
ccbd536b-f12c-4d08-ab07-88915ad86eb1	Z_FI_APROB	S_YI3_39000082                          	inst1	2026-05-08 21:21:45.802	TCD       	S_TCODE
69075fed-35e3-48f1-9668-abfb17d441c5	Z_MM_OC	S_AHR_61015615                          	inst1	2026-05-08 21:21:44.836	TCD       	S_TCODE   
e7f43a0a-ff7e-49f2-8880-4797b33a57b5	Z_MM_OC	S_AHR_61015614                          	inst1	2026-05-08 21:21:44.845	TCD       	S_TCODE   
44a79429-8945-4acb-98d5-03971427d193	Z_MM_OC	S_AHR_61015612                          	inst1	2026-05-08 21:21:44.856	TCD       	S_TCODE   
57d4313f-a845-474e-b919-06fd9d021c28	Z_MM_OC	S_AHR_61015611                          	inst1	2026-05-08 21:21:44.864	TCD       	S_TCODE   
eabe102e-ab4e-4385-b932-3f389e4eb6d3	Z_MM_OC	PUST                                    	inst1	2026-05-08 21:21:44.873	TCD       	S_TCODE   
cd2ad186-e174-448f-b4f5-93e7241952d6	Z_MM_OC	PU12_SHOW_FILE                          	inst1	2026-05-08 21:21:44.879	TCD       	S_TCODE   
89a9cb14-e329-484a-83db-2f22bcb22e25	Z_MM_OC	PU12_SHOW_CLUSTER                       	inst1	2026-05-08 21:21:44.888	TCD       	S_TCODE   
29a17cf0-d4a0-446e-81f1-cca601daefcd	Z_MM_OC	PU12_IDOC_PROCESS                       	inst1	2026-05-08 21:21:44.895	TCD       	S_TCODE   
ddbb7ff8-4bfd-45bd-94c3-516feae4bfb8	Z_MM_OC	PU12_IDOC_CREATE                        	inst1	2026-05-08 21:21:44.903	TCD       	S_TCODE   
887996a3-df1d-4ce4-9bda-e53bfc1ea6e5	Z_MM_OC	PU12_EXPORT                             	inst1	2026-05-08 21:21:44.912	TCD       	S_TCODE   
f92dde9f-6b76-4428-a1a8-eae03b28c137	Z_MM_OC	PU12_DOWNLOAD                           	inst1	2026-05-08 21:21:44.954	TCD       	S_TCODE   
47f5129a-dcd8-4efa-869c-2b4bd9d3bfd6	Z_MM_OC	PU12_CONVERT                            	inst1	2026-05-08 21:21:44.962	TCD       	S_TCODE   
e0913e9b-28e9-4516-93d4-ff937a06a006	Z_MM_OC	PC_PAYRESULT                            	inst1	2026-05-08 21:21:44.971	TCD       	S_TCODE   
d1638c25-3c3c-4c7e-acbb-335d7783fa61	Z_MM_OC	PCP0                                    	inst1	2026-05-08 21:21:44.978	TCD       	S_TCODE   
a60a1b98-1d00-49fd-94f5-15298a009cf5	Z_MM_OC	PC00_M99_PA03_RELEA                     	inst1	2026-05-08 21:21:44.988	TCD       	S_TCODE   
8800af68-40f9-4cf1-b4d0-d367f7af2c6b	Z_MM_OC	PC00_M99_PA03_END                       	inst1	2026-05-08 21:21:44.996	TCD       	S_TCODE   
00899402-f2e7-43bd-8866-1f7834ba1b03	Z_MM_OC	PC00_M99_PA03_CORR                      	inst1	2026-05-08 21:21:45.006	TCD       	S_TCODE   
e66e08f9-4573-4028-ac75-52518d4286cf	Z_MM_OC	PC00_M99_PA03_CHECK                     	inst1	2026-05-08 21:21:45.016	TCD       	S_TCODE   
364ce1bb-c3e8-46a7-8de1-c7773612c517	Z_MM_OC	PC00_M99_CWTR                           	inst1	2026-05-08 21:21:45.025	TCD       	S_TCODE   
89f475e4-556d-4efd-b5b1-4b3adea88f8b	Z_MM_OC	PC00_M99_CPRC                           	inst1	2026-05-08 21:21:45.035	TCD       	S_TCODE   
86c4a376-54db-47ad-aa5c-7c82221a04ef	Z_MM_OC	PC00_M99_CIPE                           	inst1	2026-05-08 21:21:45.048	TCD       	S_TCODE   
6a876759-17b4-43a8-919c-d3e8b3694f69	Z_MM_OC	PC00_M99_CIPC                           	inst1	2026-05-08 21:21:45.062	TCD       	S_TCODE   
6a972776-6d65-46dc-b376-c2c3c27791a4	Z_MM_OC	PC00_M99_ABKRS                          	inst1	2026-05-08 21:21:45.075	TCD       	S_TCODE   
9e8ec182-a0b3-4dd3-83cc-83b44b2af74e	Z_MM_OC	PA03                                    	inst1	2026-05-08 21:21:45.085	TCD       	S_TCODE   
58e03552-056c-4e78-bafd-774b23756b45	Z_MM_OC	FDTA                                    	inst1	2026-05-08 21:21:45.093	TCD       	S_TCODE   
e75dad5f-215e-426d-a2cc-97d4ec72e308	Z_MM_OC	KS01                                    	inst1	2026-05-08 21:21:45.102	TCD       	S_TCODE   
cf5695c8-b045-4996-b009-d28f633a84e3	Z_MM_OC	KS02                                    	inst1	2026-05-08 21:21:45.112	TCD       	S_TCODE   
1f7aeba4-6ea2-4a74-b08a-9732fb3ff0bc	Z_FI_APROB	PA30	inst1	2026-05-08 21:21:45.122	TCD       	S_TCODE   
fab4c701-df10-49d9-a1fa-8a2553dc84d4	Z_FI_APROB	PC00_M99_PA03_CORR	inst1	2026-05-08 21:21:45.129	TCD       	S_TCODE   
ef3256c8-5753-458e-90cd-e179f3fdf984	Z_FI_APROB	RSSCD100_PFCG_USER                      	inst1	2026-05-08 21:21:45.14	TCD       	S_TCODE   
a76a2834-b0d9-4c04-b110-a7042be5b6ac	Z_FI_APROB	RSUSR200                                	inst1	2026-05-08 21:21:45.152	TCD       	S_TCODE   
604a46eb-fc59-487a-8dd2-dd6856aaa63c	Z_FI_APROB	RSUSRAUTH                               	inst1	2026-05-08 21:21:45.161	TCD       	S_TCODE   
769bd751-3c5c-4f3b-9641-cf89e7dfb1f9	Z_FI_APROB	SCU3                                    	inst1	2026-05-08 21:21:45.17	TCD       	S_TCODE   
84b48134-8fb8-4820-924e-1e924d8618cb	Z_FI_APROB	SCUH                                    	inst1	2026-05-08 21:21:45.181	TCD       	S_TCODE   
9b444b3a-e3b0-4f4d-897d-78a6f167f82c	Z_FI_APROB	SECPOL_CHANGES                          	inst1	2026-05-08 21:21:45.191	TCD       	S_TCODE   
a75a88d8-3133-469e-b753-e441e97724fc	Z_FI_APROB	ST01                                    	inst1	2026-05-08 21:21:45.199	TCD       	S_TCODE   
9419402c-b189-4a74-bd1d-42b38422edef	Z_FI_APROB	SU24                                    	inst1	2026-05-08 21:21:45.209	TCD       	S_TCODE   
5764525c-5169-4720-860d-34dba5c62d41	Z_FI_APROB	SU24_HISTORY                            	inst1	2026-05-08 21:21:45.219	TCD       	S_TCODE   
12388ea2-73e1-43f8-a94c-cb884ab6bcde	Z_FI_APROB	SU25                                    	inst1	2026-05-08 21:21:45.227	TCD       	S_TCODE   
6f3c15d6-f856-4e29-b31b-9b5b634ab56d	Z_FI_APROB	SUIM                                    	inst1	2026-05-08 21:21:45.237	TCD       	S_TCODE   
937edfc0-5872-47d3-b556-387de114b645	Z_FI_APROB	SUPC                                    	inst1	2026-05-08 21:21:45.249	TCD       	S_TCODE   
7ebf2aa1-aa3c-4666-9968-c467fbb3b515	Z_FI_APROB	SU_VCUSRVARCOM_DISP                     	inst1	2026-05-08 21:21:45.261	TCD       	S_TCODE   
11709123-e42a-496f-bbaf-e328192d6fd5	Z_FI_APROB	SU_VCUSRVAR_DISP                        	inst1	2026-05-08 21:21:45.271	TCD       	S_TCODE   
2de5e782-ad63-4880-9a77-4e68115cf2ff	Z_FI_APROB	S_BCE_68001393                          	inst1	2026-05-08 21:21:45.279	TCD       	S_TCODE   
e8d12ffa-238a-4e54-a2e8-8a0f659fbbf2	Z_FI_APROB	S_BCE_68001394                          	inst1	2026-05-08 21:21:45.291	TCD       	S_TCODE   
df278cbe-2d36-4a77-9cf3-e2f06054622a	Z_FI_APROB	S_BCE_68001395                          	inst1	2026-05-08 21:21:45.301	TCD       	S_TCODE   
af7bbe74-a0de-41c2-9c1b-f8dacf0fee0f	Z_FI_APROB	S_BCE_68001396                          	inst1	2026-05-08 21:21:45.313	TCD       	S_TCODE   
53593013-4f73-4894-8ace-c213eb508305	Z_FI_APROB	S_BCE_68001397                          	inst1	2026-05-08 21:21:45.324	TCD       	S_TCODE   
b599465f-3988-457b-b3aa-a3eaea8e17db	Z_FI_APROB	S_BCE_68001398                          	inst1	2026-05-08 21:21:45.346	TCD       	S_TCODE   
084242f1-48fe-4228-aa87-874fa122209e	Z_FI_APROB	S_BCE_68001399                          	inst1	2026-05-08 21:21:45.357	TCD       	S_TCODE   
8e80287e-25c7-4789-9b5b-a4951daf54c0	Z_FI_APROB	S_BCE_68001400                          	inst1	2026-05-08 21:21:45.367	TCD       	S_TCODE   
fe7b9ac3-9bf6-43bd-8e2e-a0df19f6632b	Z_FI_APROB	S_BCE_68001402                          	inst1	2026-05-08 21:21:45.377	TCD       	S_TCODE   
c32007c3-66ec-443a-bab7-8890cc80431c	Z_FI_APROB	S_BCE_68001404                          	inst1	2026-05-08 21:21:45.39	TCD       	S_TCODE   
cea16a3d-bf08-45d7-ab11-06d664aaca36	Z_FI_APROB	S_BCE_68001405                          	inst1	2026-05-08 21:21:45.398	TCD       	S_TCODE   
bfb0d4bc-0f2e-4dc9-ab31-e8564cb00b82	Z_FI_APROB	S_BCE_68001406                          	inst1	2026-05-08 21:21:45.409	TCD       	S_TCODE   
2670f833-2adb-413b-b020-1f9360f1cb86	Z_FI_APROB	S_BCE_68001407                          	inst1	2026-05-08 21:21:45.42	TCD       	S_TCODE   
04b87921-dfd2-4962-b8e2-5774e6d2b02b	Z_FI_APROB	S_BCE_68001408                          	inst1	2026-05-08 21:21:45.43	TCD       	S_TCODE   
b2673deb-668a-49d0-aded-23237c130938	Z_FI_APROB	S_BCE_68001409                          	inst1	2026-05-08 21:21:45.441	TCD       	S_TCODE   
f6bced2e-1dba-47c1-983e-c9c300e445b3	Z_FI_APROB	S_BCE_68001410                          	inst1	2026-05-08 21:21:45.452	TCD       	S_TCODE   
8e6ca25b-9259-4864-8db3-d680ca779d44	Z_FI_APROB	S_BCE_68001411                          	inst1	2026-05-08 21:21:45.461	TCD       	S_TCODE   
61607b8d-df8a-43bb-86d1-5bb58150fee7	Z_FI_APROB	S_BCE_68001412                          	inst1	2026-05-08 21:21:45.47	TCD       	S_TCODE   
b0b924a7-cd0a-4f12-81b1-978c02c279ff	Z_FI_APROB	S_BCE_68001413                          	inst1	2026-05-08 21:21:45.481	TCD       	S_TCODE   
74a0e90c-b6d8-4d89-b0c7-e0305c6d1629	Z_FI_APROB	S_BCE_68001414                          	inst1	2026-05-08 21:21:45.493	TCD       	S_TCODE   
41eb6b9d-ae33-4f12-b8a9-839ef1c4ee44	Z_FI_APROB	S_BCE_68001415                          	inst1	2026-05-08 21:21:45.502	TCD       	S_TCODE   
15f18c95-c329-4904-9e2d-3f733d737945	Z_FI_APROB	S_BCE_68001416                          	inst1	2026-05-08 21:21:45.512	TCD       	S_TCODE   
ff848c0e-bc9e-49d5-9a00-cc3550300129	Z_FI_APROB	S_BCE_68001417                          	inst1	2026-05-08 21:21:45.524	TCD       	S_TCODE   
122f5f3b-053f-48f2-9d06-15f4067df0a1	Z_FI_APROB	S_BCE_68001418                          	inst1	2026-05-08 21:21:45.535	TCD       	S_TCODE   
bd5ba7f8-fbc6-4f84-976d-0cb9e7c04779	Z_FI_APROB	S_BCE_68001419                          	inst1	2026-05-08 21:21:45.546	TCD       	S_TCODE   
53cfcea0-5e81-4fd8-acfb-a0536c620611	Z_FI_APROB	S_BCE_68001420                          	inst1	2026-05-08 21:21:45.559	TCD       	S_TCODE   
0008949a-2087-4f55-b0ec-55ef67996716	Z_FI_APROB	S_BCE_68001421                          	inst1	2026-05-08 21:21:45.568	TCD       	S_TCODE   
7f97f244-9fc8-4993-91ee-f99e2b561823	Z_FI_APROB	S_BCE_68001422                          	inst1	2026-05-08 21:21:45.577	TCD       	S_TCODE   
c3398fef-086e-419c-be12-c21dfb4d6f89	Z_FI_APROB	S_BCE_68001423                          	inst1	2026-05-08 21:21:45.589	TCD       	S_TCODE   
e825ba2a-20a4-48e8-bfab-eb5c08b2de41	Z_FI_APROB	S_BCE_68001424                          	inst1	2026-05-08 21:21:45.598	TCD       	S_TCODE   
32049dd5-ca4c-48e9-903d-a09badbe991c	Z_FI_APROB	S_BCE_68001425                          	inst1	2026-05-08 21:21:45.607	TCD       	S_TCODE   
2a4bef27-807d-45c7-a123-3a92e6438e90	Z_FI_APROB	S_BCE_68001426                          	inst1	2026-05-08 21:21:45.617	TCD       	S_TCODE   
aeaf986d-5fbb-4067-8910-e1fdaf636308	Z_FI_APROB	S_BCE_68001427                          	inst1	2026-05-08 21:21:45.628	TCD       	S_TCODE   
4fe3575a-5e81-48f5-9a00-38bf7b913c15	Z_FI_APROB	S_BCE_68001428                          	inst1	2026-05-08 21:21:45.638	TCD       	S_TCODE   
06843878-8456-4f54-89cf-7f27f358bd72	Z_FI_APROB	S_BCE_68001429                          	inst1	2026-05-08 21:21:45.648	TCD       	S_TCODE   
3a6c538a-44a2-46bc-ba8c-d0055339c724	Z_FI_APROB	S_BCE_68001430                          	inst1	2026-05-08 21:21:45.66	TCD       	S_TCODE   
4decc2bf-9f87-443f-bf73-5858e83fd07a	Z_FI_APROB	S_BCE_68001431                          	inst1	2026-05-08 21:21:45.668	TCD       	S_TCODE   
a05eadee-1e05-423e-a0fb-98590f55da95	Z_FI_APROB	S_BCE_68001432                          	inst1	2026-05-08 21:21:45.678	TCD       	S_TCODE   
878108e2-b811-41ac-8a04-4ded63499fc2	Z_FI_APROB	S_BCE_68001440                          	inst1	2026-05-08 21:21:45.687	TCD       	S_TCODE   
53a1d132-778c-4009-bd28-0e89ff4e19ed	Z_FI_APROB	S_BCE_68001441                          	inst1	2026-05-08 21:21:45.697	TCD       	S_TCODE   
a322ec63-3a3f-4e13-8138-318cc3c13e09	Z_FI_APROB	S_BCE_68001767                          	inst1	2026-05-08 21:21:45.708	TCD       	S_TCODE   
505e0b34-a05c-4b6f-ab98-d0e56813b465	Z_FI_APROB	S_BCE_68001777                          	inst1	2026-05-08 21:21:45.717	TCD       	S_TCODE   
8ae948bf-585a-4cd4-92d0-e5d35216d4b3	Z_FI_APROB	S_BCE_68002030                          	inst1	2026-05-08 21:21:45.728	TCD       	S_TCODE   
b140b3de-d2c3-475d-b8af-d7aca292cbbf	Z_FI_APROB	S_BCE_68002041                          	inst1	2026-05-08 21:21:45.736	TCD       	S_TCODE   
ee470d94-5ec1-426c-b0c2-610be38e9438	Z_FI_APROB	S_BCE_68002111                          	inst1	2026-05-08 21:21:45.745	TCD       	S_TCODE   
33a9f7ca-e528-4569-800a-fcc527340aeb	Z_FI_APROB	S_BCE_68002311                          	inst1	2026-05-08 21:21:45.755	TCD       	S_TCODE   
239605eb-5380-47e4-9970-e54b0592181a	Z_FI_APROB	S_BIE_59000197                          	inst1	2026-05-08 21:21:45.763	TCD       	S_TCODE   
dd808cb7-7023-47a2-aff9-ec00feb28efa	Z_FI_APROB	S_BIE_59000198                          	inst1	2026-05-08 21:21:45.771	TCD       	S_TCODE   
c80c0de8-6c94-41e8-bc43-bd737377505e	Z_FI_APROB	S_BIE_59000199                          	inst1	2026-05-08 21:21:45.78	TCD       	S_TCODE   
5ec66651-6684-4854-8381-0483f8ab5572	Z_FI_APROB	S_BIE_59000249                          	inst1	2026-05-08 21:21:45.794	TCD       	S_TCODE   
5fd224b3-7604-4f79-8876-007cf52372ae	Z_HCM_MAESTRO	LSMW                                    	inst1	2026-05-08 21:21:45.811	TCD       	S_TCODE   
483b9591-5994-4514-b8c6-8135dd60d2de	Z_HCM_MAESTRO	PA20                                    	inst1	2026-05-08 21:21:45.823	TCD       	S_TCODE   
c9b4cee1-602f-469e-8615-97ac5d21ab80	Z_HCM_MAESTRO	PA30                                    	inst1	2026-05-08 21:21:45.832	TCD       	S_TCODE   
d5b43032-bdbf-4a29-892f-44d6465a68e9	Z_HCM_MAESTRO	PA70                                    	inst1	2026-05-08 21:21:45.843	TCD       	S_TCODE   
589f8647-5196-414d-a922-ac10bf2d3854	Z_HCM_MAESTRO	PT60                                    	inst1	2026-05-08 21:21:45.854	TCD       	S_TCODE   
8632b570-154f-4bd7-b2eb-762c96cdac96	Z_HCM_MAESTRO	PT63                                    	inst1	2026-05-08 21:21:45.867	TCD       	S_TCODE   
6975a71d-3080-4b26-9cb8-1b5297603e07	Z_HCM_MAESTRO	PT64                                    	inst1	2026-05-08 21:21:45.876	TCD       	S_TCODE   
8f255761-2d7e-4571-b74c-f02bf9d218ce	Z_HCM_MAESTRO	PT66                                    	inst1	2026-05-08 21:21:45.889	TCD       	S_TCODE   
82be9fb9-3e33-4a94-b582-a764f7fbaf79	Z_HCM_MAESTRO	PT_BAL00                                	inst1	2026-05-08 21:21:45.899	TCD       	S_TCODE   
6cf81250-4936-4bab-acaa-8c10ed6f02c4	Z_HCM_MAESTRO	PT_ERL00                                	inst1	2026-05-08 21:21:45.909	TCD       	S_TCODE   
6ea60330-9488-4046-b7a1-4d792b33097d	Z_HCM_MAESTRO	PT_QTA10                                	inst1	2026-05-08 21:21:45.921	TCD       	S_TCODE   
94cf638a-4cc7-459e-bff2-9f3d3234abf2	Z_HCM_MAESTRO	SM35                                    	inst1	2026-05-08 21:21:45.93	TCD       	S_TCODE   
d0faf6d9-bb86-4fa1-9242-e5db281a3168	Z_HCM_MAESTRO	SP02                                    	inst1	2026-05-08 21:21:45.94	TCD       	S_TCODE   
6fd4fe7a-4054-4c94-adcb-d61e524a556a	Z_HCM_MAESTRO	SU53                                    	inst1	2026-05-08 21:21:45.949	TCD       	S_TCODE   
353665bf-4548-4dbf-9cef-e34f532a7549	Z_FI_PAGO	LSMW                                    	inst1	2026-05-08 21:21:45.962	TCD       	S_TCODE   
9d55f4aa-ce57-4681-994e-33d733f4892d	Z_FI_PAGO	PA20                                    	inst1	2026-05-08 21:21:45.973	TCD       	S_TCODE   
2a378e61-281c-44e8-a795-37cedfa90899	Z_FI_PAGO	PA30                                    	inst1	2026-05-08 21:21:45.98	TCD       	S_TCODE   
4bf1280b-b0a5-40ef-b081-05a3425f06d8	Z_FI_PAGO	PA70                                    	inst1	2026-05-08 21:21:45.991	TCD       	S_TCODE   
b020fc2e-4286-4135-98d0-c1627f6a92d0	Z_FI_PAGO	PT60                                    	inst1	2026-05-08 21:21:46.002	TCD       	S_TCODE   
66ecbc5c-99dd-489d-8edf-7a86a8741f8a	Z_FI_PAGO	PT63                                    	inst1	2026-05-08 21:21:46.011	TCD       	S_TCODE   
bc5f1247-59af-4603-86b3-5e5996720748	Z_FI_PAGO	PT64                                    	inst1	2026-05-08 21:21:46.022	TCD       	S_TCODE   
e4ad3554-f0ea-479c-bcdc-5132aeb4c469	Z_FI_PAGO	PT66                                    	inst1	2026-05-08 21:21:46.031	TCD       	S_TCODE   
a0ea5673-cc15-4dc1-b5ce-6e89bf1a297a	Z_FI_PAGO	PT_BAL00                                	inst1	2026-05-08 21:21:46.042	TCD       	S_TCODE   
297b76b6-bbe0-4c65-87b9-2f16aa5cdd4a	Z_FI_PAGO	PT_ERL00                                	inst1	2026-05-08 21:21:46.052	TCD       	S_TCODE   
e7f95904-11f9-447b-9a98-a57cdca24052	Z_FI_PAGO	PT_QTA10                                	inst1	2026-05-08 21:21:46.062	TCD       	S_TCODE   
8ba48897-a324-4212-b995-ceafd9857109	Z_FI_PAGO	SM35                                    	inst1	2026-05-08 21:21:46.071	TCD       	S_TCODE   
585b4b9a-3909-4480-8ef5-e2bf4b38926d	Z_FI_PAGO	SP02                                    	inst1	2026-05-08 21:21:46.078	TCD       	S_TCODE   
f75305d8-d497-45e0-a26c-6f165af5a2b2	Z_FI_PAGO	SU53                                    	inst1	2026-05-08 21:21:46.086	TCD       	S_TCODE   
\.


--
-- Data for Name: GrcRuleItem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."GrcRuleItem" (id_rule_item, id_rule, object_type, object_value, seq_no) FROM stdin;
3a21cba2-fb62-4704-9ecb-abd789ab262e	76f8cb99-c5ee-4878-b527-6278f7b0aea8	TCODE	PA30	1
30bea3d5-3902-4285-871c-11b456205fc7	76f8cb99-c5ee-4878-b527-6278f7b0aea8	TCODE	PC00_M39_CALC	2
de7f02dd-7337-4ac2-b902-754577499686	7039c0e5-60a5-45ee-8001-97ca991e10e2	TCODE	PA30	1
f9939a66-23f5-4d1a-8a43-3b977ff42db4	7039c0e5-60a5-45ee-8001-97ca991e10e2	TCODE	PC00_M99_PA03_RELEA	2
0bd5bb74-625d-4e3e-925a-9dda1dd4305f	c856690a-08f1-46e1-a7d4-0f40c9c4b7f1	TCODE	PA30	1
5cdca2af-c5e8-47a1-9c7e-e6642ba93268	c856690a-08f1-46e1-a7d4-0f40c9c4b7f1	TCODE	PC00_M99_PA03_END	2
5f1d048f-93a3-4fae-8935-6e83b07b0ae3	2ae52bf3-0870-456d-bc35-2a26b8efd10e	TCODE	S_PH9_46000218	1
410c11df-2843-4456-bb63-de7e07cf318c	2ae52bf3-0870-456d-bc35-2a26b8efd10e	TCODE	S_PH9_46000217	2
bdb47d5f-ecf6-4a49-b3b0-14bd3781bc6b	7dff10a6-9821-435f-b26e-a2de00c0f43f	TCODE	S_PH9_46000221	1
7ff5d5da-49d0-46f5-a43b-716717f2ae37	7dff10a6-9821-435f-b26e-a2de00c0f43f	TCODE	S_PH9_46000220	2
8cadb02b-427a-43db-b87b-903e5952b7b8	19d0959a-d961-44e9-9d84-ac8e35e6ec81	TCODE	S_PH9_46000222	1
76c5fed6-2d05-4fe8-adb2-8c261e08c2a3	19d0959a-d961-44e9-9d84-ac8e35e6ec81	TCODE	S_PH9_46000223	2
705df797-6743-47be-9dae-fb34ee0a0a8f	700ceb21-0474-4973-a174-2252b797c7a8	TCODE	PC00_M39_CALC	1
ef0c00e7-6024-48f0-983a-83056d0e1046	700ceb21-0474-4973-a174-2252b797c7a8	TCODE	PC00_M99_PA03_CORR	2
eea4d39e-5993-4d18-b380-a401f6948e29	187dd551-bf85-4d76-a629-8d823966e561	TCODE	PC00_M99_PA03_RELEA	1
22a721ee-32ad-42a1-a60b-6d9e6c4490a8	187dd551-bf85-4d76-a629-8d823966e561	TCODE	PC00_M99_PA03_CORR	2
f5a15b82-091d-4ec3-8837-147839f671a6	71cae3f6-fd09-4400-968c-76a8759a8f13	TCODE	PC00_M39_RCPYB	1
379667fb-8b64-4345-abd3-0e4922bd07db	71cae3f6-fd09-4400-968c-76a8759a8f13	TCODE	PC00_M39_RCRT	2
9e7b1a8e-2ea1-4e65-9505-d4adc36380f3	6407d89c-f348-415e-af7e-5bac4ad9b400	TCODE	PA20	1
ffbf02e5-9b75-41d9-bec5-4c94a4e8de2f	6407d89c-f348-415e-af7e-5bac4ad9b400	TCODE	PA30	2
6518c21e-7312-4c8a-be57-e63be21dba72	b7ab4ecb-0e18-4c2b-a3eb-9cd2f3294fb4	TCODE	PC_PAYRESULT	1
bc23eb71-df08-49a4-88e7-e369fa564420	b7ab4ecb-0e18-4c2b-a3eb-9cd2f3294fb4	TCODE	PC00_M39_CEDT	2
6c5674cd-345b-43ac-a168-e9645e7e046e	9a16fde8-c0c7-48ec-abc7-a88bde1257e3	TCODE	PU01	1
586eb868-8e24-42d7-b15d-634a1b601613	9a16fde8-c0c7-48ec-abc7-a88bde1257e3	TCODE	PC00_M99_PA03_RELEA	2
2d541559-fd71-4851-a4e2-c0e0fb6f3149	4206751b-8698-4bd4-8e92-e413c004b758	TCODE	SM30	1
d032dc5c-bafc-45e3-946d-85f47bd7752b	4206751b-8698-4bd4-8e92-e413c004b758	TCODE	Cualquier transacción ECP	2
31ce0c4a-800d-410e-8a7b-23f931fdcaa3	efd7407b-9e8b-435c-b465-f9f599bac375	TCODE	S_AHR_61016354	1
c0de5012-9e28-4f26-8124-113643fa22ce	efd7407b-9e8b-435c-b465-f9f599bac375	TCODE	S_AHR_61016358	2
ee8429a1-5b19-4b37-ad79-5ea2de2faf10	d5e06645-d643-4e8f-b36f-a741cc51e51a	TCODE	PC00_M99_CIPE	1
a89a2bb9-2a55-4300-bc14-a380653244e6	d5e06645-d643-4e8f-b36f-a741cc51e51a	TCODE	PC00_M99_CIPC	2
fe32e251-31b0-4081-ae6c-10fcb82c7e19	7db90b0f-1728-4434-92ff-5f8d580dbad6	TCODE	PC00_M39_FFOT	1
7aae43c1-d1e4-4dcf-bcda-a375d1292207	7db90b0f-1728-4434-92ff-5f8d580dbad6	TCODE	PC00_M39_CDTA	2
ca21cc82-e548-4f3c-a443-b57e98b3719c	c4e30c37-40e1-49fa-bf28-9767b50af505	TCODE	PC00_M40_PREL	1
2ed8987f-6764-4825-8654-3491615c1b70	c4e30c37-40e1-49fa-bf28-9767b50af505	TCODE	PC00_M40_APPR	2
a15dc5da-f620-4219-8b99-0fe63bc46fb8	8cdfe73e-5798-424b-a25e-9eb8fcafabf9	TCODE	PC00_M40_PREL	1
31a9d514-0ae6-4025-8026-9170414e586f	8cdfe73e-5798-424b-a25e-9eb8fcafabf9	TCODE	PC00_M40_CORR	2
099cb438-6bf5-4874-b7be-71f683dab4c4	3e2514ad-9534-4c62-baae-204c9387e52f	TCODE	PC00_M40_APPR	1
4018cd5b-c733-4cd0-8105-6c1ecdd02acf	3e2514ad-9534-4c62-baae-204c9387e52f	TCODE	PC00_M40_CORR	2
a41c72ec-d1e0-43a9-946e-3ea146254d8f	aa55da05-05ce-4c7c-bcd5-c5cf490d73c9	TCODE	PC00_M99_PA03	1
5ec47a3f-def1-45aa-837b-5b8b7b36a382	aa55da05-05ce-4c7c-bcd5-c5cf490d73c9	TCODE	PC00_M99_PA04	2
6f0a3daf-2c72-4bac-930f-75e3e0146450	07e06fdd-3234-4070-84a1-83ef453b15cb	TCODE	PC00_M99_CLSTR	1
c9b02d0d-4ae6-4ae9-a4a7-553f09d31b6b	07e06fdd-3234-4070-84a1-83ef453b15cb	TCODE	PC00_M99_CLSTP	2
eafb38cb-dafc-45fb-b70c-9fa600ab9c7f	3ad8a08c-11db-42aa-8953-7034c11aadcc	TCODE	PC00_M99_TPRO	1
f25732a7-e2a6-4dcc-932f-03604484be0c	3ad8a08c-11db-42aa-8953-7034c11aadcc	TCODE	PC00_M99_TPAY	2
319f79e2-a046-4dff-a02a-9cb2b1eb73fd	bc806e1b-bd1d-4393-bc31-dc12227ca6eb	TCODE	PC00_M99_TAXCN	1
b2bf0f70-a323-4931-9b9b-ecf6c85c4bad	bc806e1b-bd1d-4393-bc31-dc12227ca6eb	TCODE	PC00_M99_TAXCR	2
242fb867-406c-42c4-b14d-e64f2f54247e	fc2e24ec-d7b6-47ae-b61f-6ede5a6157c9	TCODE	PC00_M99_BONUS	1
a1b4de97-1021-4e55-8762-4971f7440484	fc2e24ec-d7b6-47ae-b61f-6ede5a6157c9	TCODE	PC00_M99_BONUS_CORR	2
b145f509-c44d-433b-89da-6c648c33b1ad	67638211-bb51-4799-ab9d-8f2f920c0ebb	TCODE	PC00_M99_VACAT	1
1a8cc627-d4bb-4953-bdd6-24560a8691e7	67638211-bb51-4799-ab9d-8f2f920c0ebb	TCODE	PC00_M99_VACAT_PAY	2
318b7500-cf68-4e39-adbe-afd47143787a	8061c5a6-f18a-4995-bf90-d87de67b9361	TCODE	PC00_M99_LOAN	1
278f6177-3c98-4ef9-83d4-2dfbd5d2c6b0	8061c5a6-f18a-4995-bf90-d87de67b9361	TCODE	PC00_M99_LOAN_ADJ	2
b15d779f-9099-4a4a-b3fb-2883921a67ca	9d77ca55-5c45-4cf3-8602-5bced0cdc43f	TCODE	PC00_M99_TERM	1
83d69fd9-85fd-403d-970f-74b920c9355c	9d77ca55-5c45-4cf3-8602-5bced0cdc43f	TCODE	PC00_M99_TERM_PAY	2
06d0d0bc-b884-4083-a9d3-8131985ac17d	2f00a53b-1b2f-4495-8cf3-3d7c7e22b485	TCODE	PC00_M99_PENS	1
7c6c76be-b09d-4468-96e1-a9bd031ec871	2f00a53b-1b2f-4495-8cf3-3d7c7e22b485	TCODE	PC00_M99_PENS_ADJ	2
5c0ce0a8-5fa9-47c3-a72e-be4f5b793cc2	9401906d-642a-44a8-bd3f-87c1a0666ef5	TCODE	PC00_M99_MEDCL	1
1e71e07c-eb14-4540-99bc-c65d20a88a95	9401906d-642a-44a8-bd3f-87c1a0666ef5	TCODE	PC00_M99_MEDCL_PAY	2
b2a46621-69a7-452c-a8aa-4957f9ec81d1	a9cdd1d7-65e4-4bc6-afaa-a0ec57090a74	TCODE	PC00_M99_ALLOW	1
b0ae9526-2d23-4b9d-af01-277ded4f1ba5	a9cdd1d7-65e4-4bc6-afaa-a0ec57090a74	TCODE	PC00_M99_ALLOW_ADJ	2
617b6085-3c0e-4e7f-aa94-79abac555f0f	7c5acfb5-ebb2-4051-b86a-4dfce488dd0b	TCODE	PC00_M99_OT	1
15356229-b55d-48aa-a6f1-da34837733e3	7c5acfb5-ebb2-4051-b86a-4dfce488dd0b	TCODE	PC00_M99_OT_AUTH	2
adb5a649-510c-45ef-81de-f83b7dcde619	0947410b-5b5d-47a0-89d9-ac3aacee774c	TCODE	PC00_M99_INCEN	1
9c595a2d-39be-424c-a7d9-2915fcdfb8e1	0947410b-5b5d-47a0-89d9-ac3aacee774c	TCODE	PC00_M99_INCEN_PAY	2
3984c6e3-6e8e-49ea-be37-2332ae2e1196	127f5428-c595-4e20-8b55-75f34ea2a12c	TCODE	PC00_M99_DEDUC	1
3fd7d4f5-d405-4749-acd0-63defcd03381	127f5428-c595-4e20-8b55-75f34ea2a12c	TCODE	PC00_M99_DEDUC_WAIVE	2
49f4571c-7c0f-4adb-b663-c18df8806871	42524b45-6540-4a7e-8bb3-8f82a3ad18d0	TCODE	PC00_M99_GROSS	1
462663bb-0cb7-417b-be5a-6f35de45982e	42524b45-6540-4a7e-8bb3-8f82a3ad18d0	TCODE	PC00_M99_NET	2
12ad1678-ed52-4065-90ac-c3873d4fd49b	d03ab5bb-47bd-43c0-b71b-fce9ce2005f7	TCODE	PC00_M99_REPORT	1
23cb9576-9de9-45f2-ac52-965653564896	d03ab5bb-47bd-43c0-b71b-fce9ce2005f7	TCODE	PC00_M99_ADJUST	2
c1e79154-4e95-4e0a-8cfe-75028cf147cc	6501cee7-e581-4c2e-ba26-cf624055fcfd	TCODE	PC00_M99_AUDIT	1
28a1de6f-c98f-45a3-ba33-2cba3c7018ff	6501cee7-e581-4c2e-ba26-cf624055fcfd	TCODE	PC00_M99_CORRECT	2
82b951a3-bddf-4650-b50b-6ebf359a20ec	fcc6e0ae-5511-48ac-80b5-1fbb41ed0a5f	TCODE	PC00_M99_MASTER	1
f38a5be1-66ab-471c-8c21-37d9ac9944a3	fcc6e0ae-5511-48ac-80b5-1fbb41ed0a5f	TCODE	PC00_M99_PROCESS	2
4f4c15c5-6834-41f3-be9e-df93192f7ff0	ca3ef7fb-91b5-4087-96c5-6d086c7c3b13	TCODE	PC00_M99_CONFIG	1
0a4e3b25-b05c-49f5-8421-0d9b54621016	ca3ef7fb-91b5-4087-96c5-6d086c7c3b13	TCODE	PC00_M99_OPERATE	2
22b1abf1-fd7a-48c4-821b-a7d7e580c5a4	f30a3799-5f65-452b-92d2-aeb1e99172d6	TCODE	PC00_M99_VERIFY	1
2ebca1bd-bf82-466a-a41b-0cfbd760cae1	f30a3799-5f65-452b-92d2-aeb1e99172d6	TCODE	PC00_M99_EXECUTE	2
379ce7e8-3673-4609-8a6c-9a9c85728801	0813e87d-eb14-42d5-bb95-ef5211c4b61a	TCODE	PC00_M99_MONITOR	1
86c73f48-8415-4255-9c48-c67fddf80201	0813e87d-eb14-42d5-bb95-ef5211c4b61a	TCODE	PC00_M99_MODIFY	2
37336159-1b1e-4562-be40-598750d69167	a94d7a86-3f40-4a2e-b3bb-9d8f5935c519	TCODE	PC00_M99_APPROVE	1
2ea05e89-fedd-4f52-b68b-4a41874d1c88	a94d7a86-3f40-4a2e-b3bb-9d8f5935c519	TCODE	PC00_M99_INITIATE	2
dd804e2c-3dbb-4e18-9766-b598167cec33	6cff4ad2-f546-481b-9206-fbefa2303095	TCODE	PA30	1
705712b4-ecb9-4e86-8123-0b2768ab9277	6cff4ad2-f546-481b-9206-fbefa2303095	TCODE	PC00_M99_PA03_CORR	2
be9ecbe7-1f7f-490a-a71e-f20bc2e5f959	e4fc33e9-eb88-49e7-aabf-524c0f704a49	TCODE	PA40	1
e552e3d4-e3b3-47fb-9555-8c0b60180a1a	e4fc33e9-eb88-49e7-aabf-524c0f704a49	TCODE	PC00_M99_TERM_PAY	2
534eaf47-658f-4253-aaed-a78104e463ad	b3b25190-3fbd-416d-a15c-652dce4acc87	TCODE	PA70	1
c0e1ba18-18aa-468e-9c38-ba80b206c362	b3b25190-3fbd-416d-a15c-652dce4acc87	TCODE	PC00_M99_DEDUC	2
69e945d1-59aa-4c80-9bbb-6aea11ce4a0a	9edebf6c-6b19-4931-bfbf-883c7707ef2f	TCODE	PU01	1
83442138-9158-47d3-876e-b2559daa59fa	9edebf6c-6b19-4931-bfbf-883c7707ef2f	TCODE	PC00_M99_ORG_ASSIGN	2
8f6ec137-d349-4418-b9f6-5e7dd022271c	9d5d75ab-ba1e-4a61-a73c-dee8471f9dc9	TCODE	PC00_M40_PREL	1
c55d1759-4ed4-4f3a-ac1d-a66f38cfdbe6	9d5d75ab-ba1e-4a61-a73c-dee8471f9dc9	TCODE	PC00_M40_APPR	2
0e65b3a2-0036-4118-8a10-56cc2a424ac7	6ee944a9-1fa5-4152-97ed-4fa9dcb59890	TCODE	PC00_M99_CALC_ALL	1
705bd07f-1ebd-400c-9122-bdd2c9397016	6ee944a9-1fa5-4152-97ed-4fa9dcb59890	TCODE	PC00_M99_VERIFY	2
8adfc8d3-9712-46c7-879a-72945d41023b	684c5384-68fb-4ec2-9121-ae5ddc3e97f2	TCODE	PC00_M99_RUN_PAYROLL	1
4a709abd-48ef-45f1-958c-d5ebb43c8da7	684c5384-68fb-4ec2-9121-ae5ddc3e97f2	TCODE	PC00_M99_APPROVE	2
9e076cde-0b10-48a1-b34c-02ca4dc874b0	489f4632-4be1-4a62-8080-1ac32ca900a6	TCODE	PC00_M99_RETRO	1
0c4fef29-eb1e-40e9-948e-73c77ba819c9	489f4632-4be1-4a62-8080-1ac32ca900a6	TCODE	PC00_M99_CORRECT	2
acb3f457-a8f3-4fe2-9eb8-103409922b2a	a5b50657-7b40-4aae-bdaf-f7ce299ce508	TCODE	PC00_M99_AUTH_INIT	1
7a56620d-69c1-401b-994f-4e8b509ae197	a5b50657-7b40-4aae-bdaf-f7ce299ce508	TCODE	PC00_M99_AUTH_APPR	2
d9da3f7f-0b0a-43eb-82e9-411b58a340d1	9bdf17ac-d794-4ccb-b7ae-f0edec63b993	TCODE	PC00_M99_REQ_PAYMENT	1
71b41c4b-0c5b-41e8-bf51-29bf96155c4f	9bdf17ac-d794-4ccb-b7ae-f0edec63b993	TCODE	PC00_M99_APPROVE_PAY	2
c863572a-0efe-44a7-9425-174a0ad417e4	89a7a2ac-b36f-4db2-ab9e-9fb0aee41007	TCODE	PC00_M99_CREATE_DOC	1
c85bba1f-cb42-432d-b986-ed38bbe9b4ae	89a7a2ac-b36f-4db2-ab9e-9fb0aee41007	TCODE	PC00_M99_APPROVE_DOC	2
84d0d75e-57ed-4891-8acc-0739894c5db8	d8f4fa5c-a5dc-4a59-b6eb-1c9de6ca2dd4	TCODE	PC00_M99_SETUP	1
43178f3d-ad46-4e74-8b61-f26d2b36c602	d8f4fa5c-a5dc-4a59-b6eb-1c9de6ca2dd4	TCODE	PC00_M99_OPERATE	2
b171bc99-6f8f-41c6-842c-ee26706aaf62	c31775b9-d9e1-4732-bfe9-e79b74cfbada	TCODE	PC00_M99_PARAM	1
96d81b52-3d99-4171-b7d9-27c120c87dfb	c31775b9-d9e1-4732-bfe9-e79b74cfbada	TCODE	PC00_M99_PROCESS	2
0fb64fea-fcfe-4453-88f7-2e4723a8dec9	162ddc85-d7a2-4961-8df0-de3e96ec8d45	TCODE	PC00_M99_CUSTOMIZE	1
0143e8ce-b2f6-4e2f-849f-e52f788fc649	162ddc85-d7a2-4961-8df0-de3e96ec8d45	TCODE	PC00_M99_EXECUTE	2
8457666f-6e06-4f00-819b-4ece2b631596	318f2cac-aac6-473e-b368-7e2e25e07f01	TCODE	PC00_M99_AUDIT	1
bbbe030d-20d2-41fb-9ea3-eadce20cb63f	318f2cac-aac6-473e-b368-7e2e25e07f01	TCODE	PC00_M99_CORRECT	2
56e8ccbb-44b7-4fca-9f43-e34add7e1578	46cb17b4-ffe2-41c4-b1c0-1c4362fde5b4	TCODE	PC00_M99_MONITOR	1
69a4db36-fc5e-4827-a9e9-c8f9e810b8be	46cb17b4-ffe2-41c4-b1c0-1c4362fde5b4	TCODE	PC00_M99_ADJUST	2
2034c215-02e8-4940-bea7-c3f5c9692f4c	01202f3c-6f57-49b6-a1a5-07b40c0e420e	TCODE	PC00_M99_REPORT	1
be284db0-2d4f-4cd0-9728-974c8fb5b689	01202f3c-6f57-49b6-a1a5-07b40c0e420e	TCODE	PC00_M99_FIX	2
9a5d06ca-d27f-4527-aca0-346a71a0446c	6ec8d062-5bbb-45ef-a7f0-7e00c788dfd9	TCODE	SECATT	1
e8be4479-555a-4732-a83d-c8ca3fa68196	6ec8d062-5bbb-45ef-a7f0-7e00c788dfd9	TCODE	SM18	2
361b0983-80ea-4dd6-9583-4356dad4788f	8b9c3baa-0387-496f-9bcb-175124660e9f	TCODE	SECATT	1
158cbbb9-4918-4217-a618-0bc7a417e9cb	8b9c3baa-0387-496f-9bcb-175124660e9f	TCODE	SM35	2
ce7bd2d9-fc0f-4f1c-a5d3-7289b9c375e1	9a99d409-15a5-494d-aafd-da0805bc30ec	TCODE	SECATT	1
649b870c-9b3d-42d1-bed9-eb22490bf379	9a99d409-15a5-494d-aafd-da0805bc30ec	TCODE	SU01	2
aaed0e6a-939e-4ce4-a02a-ca1c23a0ab71	2c4394cf-34d1-41e4-a8bd-844576b33e65	TCODE	SECATT	1
1e3182f8-98ef-4543-b7ee-09c41f607106	2c4394cf-34d1-41e4-a8bd-844576b33e65	TCODE	PFCG	2
9a1d6a1d-3d7c-450a-80f3-079bdfb06e37	96c3d5da-cae7-4860-a5f8-1d2300b0efef	TCODE	SECATT	1
479a2806-96a9-45c6-8b21-07df42ff2ba4	96c3d5da-cae7-4860-a5f8-1d2300b0efef	TCODE	SM30	2
f62f7876-8f2b-45d7-9c4d-8286d99b9fa4	4b1bcb36-fc29-4d5a-b8cc-5d45eaca125f	TCODE	SECATT	1
805ab153-53b5-4ae7-97b8-158be49a0032	4b1bcb36-fc29-4d5a-b8cc-5d45eaca125f	TCODE	SE16	2
9f0177f7-ff43-4aa2-8108-5e05b05be06a	74a7342e-c879-4808-80ba-fc246ef699f1	TCODE	SECATT	1
4e3c347a-96a4-4de1-9013-5c1b122ad941	74a7342e-c879-4808-80ba-fc246ef699f1	TCODE	SE10	2
85100bef-d9c3-4197-979d-7b81d7b573ab	d24b662c-143a-49ef-a996-ff438fbc1bbc	TCODE	SECATT	1
9ec97607-7812-4c29-9c75-c0dc38ca6cf9	d24b662c-143a-49ef-a996-ff438fbc1bbc	TCODE	STMS	2
a75e066f-ca52-4276-bf6f-56de2f32f6ba	b585b9f1-8d62-4c86-b187-7c55a97f4838	TCODE	SECATT	1
a5ce0979-f79b-4cbb-8580-871abfee96eb	b585b9f1-8d62-4c86-b187-7c55a97f4838	TCODE	PA30	2
b50ee0d0-b819-46b3-8784-08eac0a58bb8	27cbde8d-047b-4212-88bb-cc6936dceada	TCODE	SECATT	1
3b29479b-99d1-4690-961d-bfc0372c78e0	27cbde8d-047b-4212-88bb-cc6936dceada	TCODE	PA20	2
23046bd3-b040-419f-9e63-7566d16c51ce	f7c85c9f-cd96-4efb-b9cc-452a4e4e5f0c	TCODE	SECATT	1
4d9021a7-e547-470e-868f-92fae85611e9	f7c85c9f-cd96-4efb-b9cc-452a4e4e5f0c	TCODE	PP01	2
4a928844-ea69-453c-a86c-b5bc034712d3	f693f36b-9dff-4900-9146-3b81ab1d75bf	TCODE	SECATT	1
db270ecf-4f61-4e24-9a08-e0e76634c076	f693f36b-9dff-4900-9146-3b81ab1d75bf	TCODE	PPOME	2
49c8aa58-bdd2-49dc-9451-63556e346825	6d04bf31-f2ea-4ac9-af41-24fb7b0c502d	TCODE	SECATT	1
703c770c-c4b6-4ad1-9df3-dec16dc3abb1	6d04bf31-f2ea-4ac9-af41-24fb7b0c502d	TCODE	PA40	2
6800d36c-6f14-4f99-bf75-e689cb642961	85b644a5-18e6-4951-9103-f2fd0d959143	TCODE	SECATT	1
bee77776-5849-4c00-92bb-bde00c2e3932	85b644a5-18e6-4951-9103-f2fd0d959143	TCODE	PA70	2
3a988308-0477-4c2d-a3c4-288984149688	72126de4-fa29-4983-935c-1f182ce7b5a8	TCODE	SECATT	1
aee15bf4-dad2-43f8-a18b-23717b23dfc2	72126de4-fa29-4983-935c-1f182ce7b5a8	TCODE	PC00_M40_PREL	2
2c50ce70-9ccf-4ff0-830c-2fb9284a9185	dfc6863b-e211-494d-8af5-e69f0a2477b6	TCODE	SECATT	1
f6049f80-d846-4610-ab1c-d15d68643630	dfc6863b-e211-494d-8af5-e69f0a2477b6	TCODE	PC00_M99_CALC	2
f27f47d1-cfad-4831-a475-7afe7f1adeff	87e01de7-4989-40db-a694-597277e6dcea	TCODE	SECATT	1
17f3df40-eb17-4c80-80a9-bdad5d3a10c2	87e01de7-4989-40db-a694-597277e6dcea	TCODE	PC00_M99_RUN	2
deb8e930-a962-4a6b-a086-ddf78ac0b893	8d84b47f-76c6-4047-b79b-f88f59209e13	TCODE	SECATT	1
2db056d2-3a65-4100-acf7-abcb0859e96a	8d84b47f-76c6-4047-b79b-f88f59209e13	TCODE	PC00_M99_PA03	2
274357f7-720c-4921-b9fd-1b40524f2258	07c113d3-3778-4167-85c4-9c4f507b91c2	TCODE	SECATT	1
821a81fe-591a-40b2-80ae-5c61d1b8b56e	07c113d3-3778-4167-85c4-9c4f507b91c2	TCODE	PC00_M99_CLSTR	2
5a5672d9-9ee3-4626-8f8b-1358220ba385	63d53c58-2588-412c-871c-4ea5dc88e937	TCODE	SECATT	1
49a8dd5f-f3a4-416e-b317-e2ed619b8729	63d53c58-2588-412c-871c-4ea5dc88e937	TCODE	PC00_M99_TPRO	2
6da7eb20-a407-49e5-b8a6-91ddf86a34cf	7f8445a4-e35d-416b-a266-54f6ef0794b1	TCODE	SECATT	1
90c61f45-64ba-4e72-9d9d-f0b7f7b68478	7f8445a4-e35d-416b-a266-54f6ef0794b1	TCODE	PC00_M99_PAYRUN	2
ba07c92d-cb11-49b5-b24e-15706a818687	03d7cbc6-fae8-49d3-82ce-1f3fca8cef3a	TCODE	SECATT	1
07acd269-d672-4dd7-a37e-50d483db4026	03d7cbc6-fae8-49d3-82ce-1f3fca8cef3a	TCODE	PC00_M99_DM_CREATE	2
bd46349a-9748-40db-b2ce-f92ce71d1d89	6d802fc3-c2e2-4599-a4b8-d7aa96563ca0	TCODE	SECATT	1
76e283c4-2048-497c-8857-f23b46a024e8	6d802fc3-c2e2-4599-a4b8-d7aa96563ca0	TCODE	PC00_M99_BANK_EXPORT	2
21c5c0b1-52a8-4584-af8c-0dee33ad520d	27bcca27-e6fa-40a2-889a-4f18b312fa37	TCODE	SECATT	1
d80a2795-671f-4ed9-a930-2bc02bc4c489	27bcca27-e6fa-40a2-889a-4f18b312fa37	TCODE	PC00_M99_WT_CALC	2
48c08025-e9ba-4c07-9864-e8c2a0d7210d	2596284c-3cf6-41f4-bfc7-eca307e9d5d8	TCODE	SECATT	1
0a6f5491-2491-4e89-b058-a0894622c2f3	2596284c-3cf6-41f4-bfc7-eca307e9d5d8	TCODE	PC00_M99_ACH_GEN	2
fc1ea22f-6ab4-47cb-be60-acb408222801	a6975ed1-b1c1-4baa-9be7-82b9d9e9e6e1	TCODE	SECATT	1
a30a7cc7-e062-49c3-8274-5f1774d93a34	a6975ed1-b1c1-4baa-9be7-82b9d9e9e6e1	TCODE	PC00_M99_SALARY	2
8e4e263a-b3e0-471e-bf4a-25b0fe1b0177	86a8c8e4-186e-411e-9acb-b1f086da527a	TCODE	SECATT	1
c43db499-2760-4b70-a9fb-3d9267ba6112	86a8c8e4-186e-411e-9acb-b1f086da527a	TCODE	PC00_M99_BONUS_CALC	2
2fbed66a-a351-444a-89c3-ebb102c74da2	95e2b4bb-ffbe-4c5f-b661-398b1a6def51	TCODE	SECATT	1
5f096880-147e-449b-b0b5-1357c8afa6fa	95e2b4bb-ffbe-4c5f-b661-398b1a6def51	TCODE	PC00_M99_STOCK_GRANT	2
c2c18e4e-5c70-4b4e-bcb2-c4c634dff74a	6e2ddca3-a0bb-4c9e-bbb9-8d3da5f322d8	TCODE	SECATT	1
b4d773dd-c170-4e14-9b96-d2ffe605ee6f	6e2ddca3-a0bb-4c9e-bbb9-8d3da5f322d8	TCODE	PC00_M99_COMM_CALC	2
42a3a549-75c2-4b3b-9299-e13eedc6166b	db37f0c0-3b25-4eb6-b38e-a59d4450a248	TCODE	SECATT	1
14bd78e3-29b8-4f3f-9a34-48f921f57670	db37f0c0-3b25-4eb6-b38e-a59d4450a248	TCODE	PC00_M99_INC_PLAN	2
cc9d91fb-a293-4bcd-beae-cf8a2b389bd8	11ebee10-39a8-4b6e-903a-dba0d05dd2cf	TCODE	SECATT	1
6163f57f-d002-4cf8-a8f3-2ea6f22a4556	11ebee10-39a8-4b6e-903a-dba0d05dd2cf	TCODE	PC00_M99_TIME_REC	2
128aeb16-2651-45e7-bf7f-63e08e07208e	f38a0baf-dc0a-4b18-87fe-839addd27f6b	TCODE	SECATT	1
d4d04967-187f-4331-a6ea-a34c0be0d21d	f38a0baf-dc0a-4b18-87fe-839addd27f6b	TCODE	PC00_M99_ATTENDANCE	2
442a27ab-c9d7-483e-81c5-20254731164e	25c61509-23de-4862-9235-129b79ac2a9f	TCODE	SECATT	1
c7c58228-94fe-4c75-9c7e-8c820d8add29	25c61509-23de-4862-9235-129b79ac2a9f	TCODE	PC00_M99_OT_ENTRY	2
07634a3e-5e54-4112-bd9b-fcd9605e1ca7	f7c83f7c-da74-4d93-a885-152336e005c2	TCODE	SECATT	1
4c18c20b-f59e-4f95-ac70-d22c9fbbf055	f7c83f7c-da74-4d93-a885-152336e005c2	TCODE	PC00_M99_LEAVE_REQ	2
0724028c-ccb3-4e82-8c32-4d8f275d3f05	64541df8-1a9a-44f8-b0f4-3ac1106d371b	TCODE	SECATT	1
7e17c420-150c-45cc-8380-7beae8167c21	64541df8-1a9a-44f8-b0f4-3ac1106d371b	TCODE	PC00_M99_SHIFT_PLAN	2
bb1cadd0-3a0d-42a1-be77-9a881ee3689c	7ec514c3-2b66-4b27-b9ec-d976ceeac0a6	TCODE	SECATT	1
53ac5f1b-e335-4b4b-af2e-873b19afc5d4	7ec514c3-2b66-4b27-b9ec-d976ceeac0a6	TCODE	PC00_M99_AUDIT	2
7ac5db4a-a743-406c-9227-4c88dd49ddf5	8643f0d3-f40f-4146-a162-e1f32ad65761	TCODE	SECATT	1
c375744c-ccde-4395-80b9-c4a77e9961e5	8643f0d3-f40f-4146-a162-e1f32ad65761	TCODE	PC00_M99_REPORT	2
06743131-4309-4ee1-8ffe-ea9f757ee1ed	1619bee7-882d-4477-a033-71740740c52e	TCODE	SECATT	1
a7e0c48f-aa38-4ccb-bfb0-d41e4b693634	1619bee7-882d-4477-a033-71740740c52e	TCODE	PC00_M99_MONITOR	2
642a51b7-4b1b-4550-b6b8-090e6871d4be	09636a9e-b93f-4de1-90d9-7963f1b084f3	TCODE	SECATT	1
d5278866-8ab3-4b3d-b0fc-eb38b2908099	09636a9e-b93f-4de1-90d9-7963f1b084f3	TCODE	PC00_M99_ANALYZE	2
a3b13a7d-6c09-47cc-be8e-d3a251d6273d	b30ad862-a1d6-4a37-8574-aa49bce160be	TCODE	SECATT	1
3b546c2d-d999-4e01-a69f-bc84db8aa9e1	b30ad862-a1d6-4a37-8574-aa49bce160be	TCODE	PC00_M99_EXTRACT	2
e5d46c91-8ad3-4325-a417-8df9a84060a4	97934e8a-2b46-490e-bea9-2007460ac8b4	TCODE	SECATT	1
ab37aaa4-ce87-4683-b058-13bfac8aeb45	97934e8a-2b46-490e-bea9-2007460ac8b4	TCODE	SPRO	2
56c49a52-f20a-4c1d-896a-fe4ab3410e8d	1840eaf3-7376-4f2f-afb7-8ed0de38c73d	TCODE	SECATT	1
a9bdfa6c-c043-47fe-b9cd-56073c048e0f	1840eaf3-7376-4f2f-afb7-8ed0de38c73d	TCODE	PC00_M99_CUSTOMIZE	2
e46af836-4629-4190-ac63-371dc7d65bca	17a08be4-40e7-4f09-91da-4b9fcf367339	TCODE	SECATT	1
af677f56-30d3-4e1d-8f94-138c6a945770	17a08be4-40e7-4f09-91da-4b9fcf367339	TCODE	PC00_M99_SETUP	2
b7f4c1d6-0c41-44da-baba-e24a1c3a7bdc	d7a196c5-5ecb-4adc-ba6b-9beeda9bdfd3	TCODE	SECATT	1
10e07827-92f6-44e7-9599-cb6823d58776	d7a196c5-5ecb-4adc-ba6b-9beeda9bdfd3	TCODE	PC00_M99_PARAM	2
4aa7ecf8-47c0-48fc-bca1-e9bdfb865fe4	58ab7f46-e879-45db-8819-5265096b9b20	TCODE	SECATT	1
a7e263e0-721e-46fc-83e0-9e82cf1c82b2	58ab7f46-e879-45db-8819-5265096b9b20	TCODE	PC00_M99_SCHEMA	2
3c4b0d5a-69bc-4913-b7dc-b649c25d6c13	f0e11df1-4e8c-4fd9-a45b-7012dac75106	TCODE	SECATT	1
b7382669-6392-43b1-8bab-e31d3db44fdd	f0e11df1-4e8c-4fd9-a45b-7012dac75106	TCODE	S_PH9_46000218	2
51d0c77f-da2c-4d69-9c53-c93490e322be	9e944468-dba7-4584-a168-f162e0a24e56	TCODE	SECATT	1
a9823cb3-5711-4e80-b0ee-f5c7535cc552	9e944468-dba7-4584-a168-f162e0a24e56	TCODE	S_AHR_61016354	2
0aa62e2a-1538-4e44-ba8c-2cee665be473	db86415e-fb33-449d-a654-2a792643730e	TCODE	SECATT	1
62d53ba9-2560-40d2-9b57-4f1686fef459	db86415e-fb33-449d-a654-2a792643730e	TCODE	S_AHR_61016362	2
510e5e65-cbb4-4994-bb9a-73d6810928eb	d42bd1d1-89f9-4ef4-a559-e605ad0fcdc0	TCODE	SECATT	1
0a28f2c3-2207-4b86-ace9-c47e3e9b71f7	d42bd1d1-89f9-4ef4-a559-e605ad0fcdc0	TCODE	S_PH0_48000450	2
31990f12-1936-4422-b66b-a432c5a19889	4b3bf07d-43fa-4698-9cff-22088a60dda8	TCODE	SECATT	1
8037bf20-1148-467f-8c94-9aef404b2384	4b3bf07d-43fa-4698-9cff-22088a60dda8	TCODE	HCPT_MONITOR	2
a99195b6-290a-4fbc-91ed-f1aefc8d50ed	fa5b6b0a-3b6c-4650-9e3e-215f64bb13f5	TCODE	SECATT	1
d5fda898-0e96-4a14-a553-089811b8cefc	fa5b6b0a-3b6c-4650-9e3e-215f64bb13f5	TCODE	PCL1	2
a84e169e-1e83-4dd8-8d2a-1da422e4a441	faaa787d-e359-4a66-ba80-f0925e24365d	TCODE	SECATT	1
40b0518f-21f1-4686-a78e-1fa2ce7c505a	faaa787d-e359-4a66-ba80-f0925e24365d	TCODE	PYXX_C	2
a41fabd3-8530-420a-b77c-cb85c1697dff	15ae1026-ace2-4502-b42c-ff308835394e	TCODE	SECATT	1
fc64642a-b63f-4333-a62a-04fbe8f1c528	15ae1026-ace2-4502-b42c-ff308835394e	TCODE	RPCPCMP0	2
e03d0e6b-53f1-4a01-b69e-fde38064107b	e41d82bd-55ad-46ca-b569-118fe9d502c9	TCODE	SECATT	1
a0681a6e-fc1d-4ada-a9fe-fbf8faca4722	e41d82bd-55ad-46ca-b569-118fe9d502c9	TCODE	PC_PAYRESULT_D	2
3c3885c4-a639-4268-a0a7-d7f91042b1d3	59c51eb4-f3bc-47ce-b3f5-bfd2ec442fd4	TCODE	SECATT	1
490c7e96-c5bd-4c33-884f-db26e054c9dc	59c51eb4-f3bc-47ce-b3f5-bfd2ec442fd4	TCODE	PC00_M99_RETRO	2
2d1f583e-4043-46c2-8779-4ad8758e72da	9c4e34f7-b53f-4f29-a8b0-49fcbd644511	TCODE	SECATT	1
46bf20b8-e2c0-45be-aa32-81044f12acea	9c4e34f7-b53f-4f29-a8b0-49fcbd644511	TCODE	PC00_M99_TAXCN	2
714592d5-dbc9-4dc4-b70a-399997076736	6f4dfe6a-f4a5-49a7-9bfb-40c69e72b647	TCODE	SECATT	1
574a5c1f-572c-4f37-8f56-88c6258e9d0b	6f4dfe6a-f4a5-49a7-9bfb-40c69e72b647	TCODE	PC00_M99_VACAT	2
9e2dc78d-6142-4401-9445-c591f22159c7	4680d9d5-4567-412d-856d-8e3cc3d64714	TCODE	SECATT	1
f3217d13-e89e-4ab6-8dfe-4b41b67928d0	4680d9d5-4567-412d-856d-8e3cc3d64714	TCODE	PC00_M99_LOAN	2
2f6d2c84-8fe0-475d-841f-d7fdd3273107	4043f622-492e-4d5c-a2bc-717674db317f	TCODE	SECATT	1
d3c3efca-186b-40cc-96de-25721df37c99	4043f622-492e-4d5c-a2bc-717674db317f	TCODE	PC00_M99_PENS	2
d121382a-0c4d-41bb-9851-c3138f5aaade	ec92dbd3-7bbf-436d-b661-bab5f486d51e	TCODE	SECATT	1
ce823674-dda6-4d95-b300-694b154da73a	ec92dbd3-7bbf-436d-b661-bab5f486d51e	TCODE	PC00_M99_MEDCL	2
ea9db9dd-5a01-4e8e-acd9-0eacc5c80e59	60e18d18-0212-4d88-85a7-803554af7743	TCODE	SECATT	1
aaddc8a0-8713-41db-aa1c-6c6bbdbf62e1	60e18d18-0212-4d88-85a7-803554af7743	TCODE	PC00_M99_ALLOW	2
2871a4d8-8cea-40d8-94bd-9aff9f4fc314	3042e0f6-06eb-4ef9-82c9-ad12a70a02d1	TCODE	SECATT	1
c478da5d-f7ae-47d6-9c48-dd040b45f1ea	3042e0f6-06eb-4ef9-82c9-ad12a70a02d1	TCODE	PC00_M99_GROSS	2
7a9b409a-b767-4f39-982c-09af411d3047	49cb2d48-261e-4584-b06b-e64149b2f692	TCODE	SM30	1
17802631-160c-490a-aa1f-ccd137d19c20	49cb2d48-261e-4584-b06b-e64149b2f692	TCODE	PA30	2
2e61620c-8c23-4fd7-a9c5-b7f5b513a9a3	1c1cae2b-17a2-46fa-9f87-db3c56e6b8fd	TCODE	SM30	1
f94164ab-a75c-4c9a-ad7e-c7c0d09f5258	1c1cae2b-17a2-46fa-9f87-db3c56e6b8fd	TCODE	PA20	2
d96e8d46-a5d6-494b-a5b3-b61a880c1278	2e180b33-6232-4d69-aee0-7fd9531a88db	TCODE	SM30	1
234f9f52-7d76-46d8-99b6-65f19b94bc6d	2e180b33-6232-4d69-aee0-7fd9531a88db	TCODE	PA40	2
0216d94b-4e02-476b-9003-76dd1c0476db	9ed28259-8320-40a0-a005-09e7ee232033	TCODE	SM30	1
75ca97e6-685d-49b4-96a8-a2752b5bcdfc	9ed28259-8320-40a0-a005-09e7ee232033	TCODE	PA70	2
31ad8f92-7471-48e7-a73b-a5ffe78768b1	70781d0f-2046-4d7e-b77c-600f86d56aa2	TCODE	SM30	1
54a6b101-d6f6-4df1-9aa1-a3b68458fc11	70781d0f-2046-4d7e-b77c-600f86d56aa2	TCODE	PC00_M40_PREL	2
78df401c-65b4-4a11-8ef1-187f11a2f387	8240829b-399c-4c89-9651-2a7969c994fc	TCODE	SM30	1
057c27dd-4b92-41db-a145-c618a95b4cbd	8240829b-399c-4c89-9651-2a7969c994fc	TCODE	PC00_M99_CALC	2
9a35ddc0-4c99-401c-8f4d-9a5360663258	5da24ffc-e261-43de-bc0a-dbf77a7d91ad	TCODE	SM30	1
1b06376d-19e8-4ec3-aeba-88e7f3d69e49	5da24ffc-e261-43de-bc0a-dbf77a7d91ad	TCODE	PC00_M99_RUN	2
6313c8e5-794d-4da2-b8e3-c05d07f007ca	1f6bf039-8d23-4e96-8546-77590a5f4974	TCODE	SM30	1
59c15e4c-90c7-4860-8d96-8042dedfa002	1f6bf039-8d23-4e96-8546-77590a5f4974	TCODE	PC00_M99_PA03	2
33249258-efc3-4c8a-8a67-9fe6e75a4adf	b4655884-ce30-40d3-b9b2-12c322d9da48	TCODE	SM30	1
1bf90269-bcb2-4090-bea3-7d40be6a459d	b4655884-ce30-40d3-b9b2-12c322d9da48	TCODE	PC00_M99_CLSTR	2
cd4b4376-bf36-4033-9833-9602f194fcb0	0d419bcd-9261-400b-917b-b8da4a34fdcc	TCODE	SM30	1
aeb905e1-6325-46ec-806f-88fd3512016d	0d419bcd-9261-400b-917b-b8da4a34fdcc	TCODE	PC00_M99_TPRO	2
6aee0394-d79f-4ac1-b8a0-d1f08012d46d	122f0838-6b2c-45ed-a3fe-882edbc0cf32	TCODE	SM30	1
f449be8e-55da-44b0-b8a6-45b4642ae0a0	122f0838-6b2c-45ed-a3fe-882edbc0cf32	TCODE	PC00_M99_PAYRUN	2
2968098b-a2b0-4744-98ef-6d7c3a401c39	9e459bf8-7a4b-4990-a9b6-c0d1d8a7d9eb	TCODE	SM30	1
a88d92d5-7514-4706-ad90-22bbbad8a81b	9e459bf8-7a4b-4990-a9b6-c0d1d8a7d9eb	TCODE	PC00_M99_DM_CREATE	2
7117016c-226d-406c-8596-22b749ed1ea7	8e12b7a6-fe85-46b5-8ad8-955831ef905e	TCODE	SM30	1
a6ea6608-80c4-4e68-9a12-16cde75ae517	8e12b7a6-fe85-46b5-8ad8-955831ef905e	TCODE	PC00_M99_BANK_EXPORT	2
7b77ad94-13c4-45be-ac50-0ef965b21135	70c65733-e86c-46ad-b33b-f8d292c47ffa	TCODE	SM30	1
93ebf777-d270-437e-9d49-e78f457db72c	70c65733-e86c-46ad-b33b-f8d292c47ffa	TCODE	PC00_M99_WT_CALC	2
df8ebd6d-77ab-4064-b0e0-1a8be07bb52c	159dc4e8-1601-4cc2-9876-e835f3bbf328	TCODE	SM30	1
49533736-d939-4719-9201-38104dc53484	159dc4e8-1601-4cc2-9876-e835f3bbf328	TCODE	PC00_M99_ACH_GEN	2
19a92929-c184-4abe-bc74-85dfb8abf5c7	21303f2f-8cad-4dac-bc0d-6f727c64a04f	TCODE	SM30	1
a716829f-709b-498e-a599-847539f23e7c	21303f2f-8cad-4dac-bc0d-6f727c64a04f	TCODE	PC00_M99_SALARY	2
a3d0da48-c878-4dc0-93d2-62d75c0af5b3	e794babc-f05b-4851-9e28-915e34eae328	TCODE	SM30	1
5c285e7f-25df-4f33-a663-14b9100bd221	e794babc-f05b-4851-9e28-915e34eae328	TCODE	PC00_M99_BONUS_CALC	2
d821af83-0dd1-475e-a0c5-95d9cfeca35c	1213a3c8-b83b-4554-9d81-f23500b6ee91	TCODE	SM30	1
bdd90b4b-4edd-4df3-927f-3bd91bad8bcb	1213a3c8-b83b-4554-9d81-f23500b6ee91	TCODE	PC00_M99_STOCK_GRANT	2
999821e1-5a68-4645-a8b1-c1b93a00a25f	bb1584fb-5b2f-43f0-bf4e-376538427e50	TCODE	SM30	1
80ce8287-2646-4b6a-9483-d5f30806df99	bb1584fb-5b2f-43f0-bf4e-376538427e50	TCODE	PC00_M99_COMM_CALC	2
4fddd9be-379f-4387-933e-7463bbe069c6	06f413c2-da61-47da-9316-aa1cc3b697ff	TCODE	SM30	1
967039a5-4aaa-4dcf-86ab-c287ef8c9ac0	06f413c2-da61-47da-9316-aa1cc3b697ff	TCODE	PC00_M99_INC_PLAN	2
f819116d-7611-4a05-a7b6-184f3dc01a06	dac4a515-67eb-496d-b0cd-8990ad675656	TCODE	SM30	1
ca6b5601-6c3d-46f9-b9c8-583969607300	dac4a515-67eb-496d-b0cd-8990ad675656	TCODE	PC00_M99_TIME_REC	2
d45b7f89-0fe3-4661-afd7-b8885de24e5d	3181d596-8adc-420c-b9c7-ae18eb664c13	TCODE	SM30	1
330bccde-cb63-4801-b22a-63fe372d1484	3181d596-8adc-420c-b9c7-ae18eb664c13	TCODE	PC00_M99_ATTENDANCE	2
a7811627-496a-4deb-955f-0701c9904e69	3885fc36-ac0e-4aec-8a92-0018f3346006	TCODE	SM30	1
1082b1fb-2928-4400-8276-b26c4045ad66	3885fc36-ac0e-4aec-8a92-0018f3346006	TCODE	PC00_M99_OT_ENTRY	2
929fff79-4bcd-4c68-868d-6195538d48a9	3d4d3432-4e1e-4705-8938-21f7b70d37d3	TCODE	SM30	1
5fa29961-8567-4bf3-a7b8-3f2777ca8eff	3d4d3432-4e1e-4705-8938-21f7b70d37d3	TCODE	PC00_M99_LEAVE_REQ	2
6304f3c3-b4d5-4dbd-8c4a-5a5356fc46a1	2f945493-01c8-4ff3-891d-7ed31480e2d7	TCODE	SM30	1
11e6d899-df34-4721-8594-1df00aa16949	2f945493-01c8-4ff3-891d-7ed31480e2d7	TCODE	PC00_M99_SHIFT_PLAN	2
55bead2a-ef0f-4010-8f0e-3d21b45450f0	4d027d2a-d58e-4c2f-912c-5858158ab395	TCODE	SM30	1
d71bc9e1-0443-4f3e-ab35-513b2edaa120	4d027d2a-d58e-4c2f-912c-5858158ab395	TCODE	PC00_M99_AUDIT	2
d5e5a58d-9785-414e-a4aa-ec8da4cc1863	b0ea7c69-fbce-4013-ac95-555245ec288b	TCODE	SM30	1
d8061f9d-b669-4f63-a7eb-948340f11ca2	b0ea7c69-fbce-4013-ac95-555245ec288b	TCODE	PC00_M99_REPORT	2
db4fcaf6-d3a9-4c62-8454-176529119bd8	b2beb13b-9488-4946-9102-5e554144ac77	TCODE	SM30	1
d8fc74cb-0b49-42b8-a611-a80852c64fef	b2beb13b-9488-4946-9102-5e554144ac77	TCODE	PC00_M99_MONITOR	2
fc43ffeb-8398-4ba1-a30c-22c960cc5921	4f13e38b-468f-4c65-8072-b7d4f6ed485e	TCODE	SM30	1
5ca22a4f-bf30-43bb-a17a-f98de579a937	4f13e38b-468f-4c65-8072-b7d4f6ed485e	TCODE	PC00_M99_ANALYZE	2
44676737-6d23-4bfa-a408-500b8cab719c	f4074ee6-5ecf-46e4-8444-5cadb8c67fc0	TCODE	SM30	1
2b1ff90c-ea7b-4901-80d4-08b5b5e6dcd5	f4074ee6-5ecf-46e4-8444-5cadb8c67fc0	TCODE	PC00_M99_EXTRACT	2
9cd29f71-1f87-4f9a-90d3-830f52854ff7	0a11088b-8f00-49b9-9e1c-e5500503cf2e	TCODE	SM30	1
31201e17-7808-4cda-815e-85bc16be17f3	0a11088b-8f00-49b9-9e1c-e5500503cf2e	TCODE	PC00_M99_CUSTOMIZE	2
73f50b75-de59-452d-949b-fc673cdde70e	4dd42789-2f7f-4929-b27e-f25b64c255ca	TCODE	SM30	1
1f660b92-0b44-406a-ae82-39aa2491c853	4dd42789-2f7f-4929-b27e-f25b64c255ca	TCODE	PC00_M99_SETUP	2
13d50fcc-6a96-4969-833b-033077027982	8ad388ae-5037-4e65-af5b-14c2e5137ed6	TCODE	SM30	1
9a7ccee5-36e1-416a-b53f-1880f3fb9c15	8ad388ae-5037-4e65-af5b-14c2e5137ed6	TCODE	PC00_M99_PARAM	2
434bb202-164c-422a-9831-417ed1cdbcea	db33dcc6-431c-4261-bd45-2c366f95a2b9	TCODE	SM30	1
76071b2e-11af-4ae9-9fc2-e81dee6fe598	db33dcc6-431c-4261-bd45-2c366f95a2b9	TCODE	PC00_M99_SCHEMA	2
4eb71156-9890-4953-90ea-6c9081e01e2c	3e12082d-af50-4e7a-b5ad-590939c33fdb	TCODE	SM30	1
f1b63211-b0c2-4b50-9f45-a51c40534500	3e12082d-af50-4e7a-b5ad-590939c33fdb	TCODE	PCL1	2
fe0b89a5-b5f6-4e1c-af85-48b06494a195	6456ec06-2388-4e94-8159-7d062114fe8b	TCODE	SM30	1
721f600f-ec02-45af-affd-fd43c64f8612	6456ec06-2388-4e94-8159-7d062114fe8b	TCODE	PC_PAYRESULT_D	2
70897734-4ff9-4136-affa-bdf3d7449a67	cc103919-1b46-48ad-9c47-8337af79aa62	TCODE	SM30	1
c2754c48-c956-4d38-a569-e9decddd2ccb	cc103919-1b46-48ad-9c47-8337af79aa62	TCODE	PC00_M99_RETRO	2
a0654548-2439-4f40-a485-50e8cb2f9371	57e4769f-463b-413f-a474-b4e2850c83ea	TCODE	SM30	1
d01b8d23-663e-42fc-9994-22d5c532f4a4	57e4769f-463b-413f-a474-b4e2850c83ea	TCODE	PC00_M99_TAXCN	2
e6c782ba-a70a-41a9-a458-4c15f2f87e6c	958ac12b-19c7-486b-9b0d-b254e0aaef63	TCODE	SM30	1
7a67bed4-984f-49b7-8208-97ad2cb6a9b3	958ac12b-19c7-486b-9b0d-b254e0aaef63	TCODE	PC00_M99_VACAT	2
83a7f5e5-46a4-42a5-b714-8e7101004ed7	484980de-662d-4bf4-90ed-531ef09e2504	TCODE	SM30	1
e2d83bdd-6a75-4775-82f5-27333518fc91	484980de-662d-4bf4-90ed-531ef09e2504	TCODE	PC00_M99_LOAN	2
0db07f6e-ad96-4d25-9bcf-25863d3661d2	9c615f43-ece0-49ad-aadd-399c03d2bdf4	TCODE	SM30	1
7805a5b8-006d-494c-aef1-bd37e78ff42b	9c615f43-ece0-49ad-aadd-399c03d2bdf4	TCODE	PC00_M99_PENS	2
ee9424fa-f03b-4568-a7f7-1d74e31fde45	af8e8dc4-f371-4368-b578-e94be4d5b60b	TCODE	SM30	1
b10ddf6f-e546-434d-9ca3-212b08ab0580	af8e8dc4-f371-4368-b578-e94be4d5b60b	TCODE	PC00_M99_MEDCL	2
781f36fb-c986-4b94-b86d-143215329675	759e0c94-90ab-4489-8b2b-87af725925b1	TCODE	SM30	1
2bcb375d-b489-48a2-a133-f554adbbf21d	759e0c94-90ab-4489-8b2b-87af725925b1	TCODE	PC00_M99_ALLOW	2
93ac0b2d-5075-4134-99ab-07ec306a9dd2	f94282b6-5e00-4498-81f9-f6be6c3a59cf	TCODE	SM30	1
a33f14ba-8b39-4d86-a7b7-db94ffe9b5b9	f94282b6-5e00-4498-81f9-f6be6c3a59cf	TCODE	PC00_M99_GROSS	2
8ba58654-96ad-4094-9931-c14dfc82f4d6	27ae9fae-6029-4a48-9f59-5c9bd331c6c2	TCODE	PFCG	1
58d9c6f3-f644-4098-91f7-fd6724b871cc	27ae9fae-6029-4a48-9f59-5c9bd331c6c2	TCODE	SECATT	2
7fadfa88-f406-434d-bfb3-67777b2981d8	46a4b7ff-2948-426b-be8e-185afbf4f52c	TCODE	PFCG	1
7b5c6bbd-14cf-428e-a16b-8ac9c729af17	46a4b7ff-2948-426b-be8e-185afbf4f52c	TCODE	SM18	2
22a67947-ec37-4fa4-beff-4576080e273c	854aea20-3a96-4057-ab70-942497e63e70	TCODE	PFCG	1
3315549d-ebb8-46c2-9d76-7d77f67db1d7	854aea20-3a96-4057-ab70-942497e63e70	TCODE	SM35	2
826bf787-3238-4ead-a7a5-5fa2bcf81bb6	3693ebb7-ce17-40a4-b311-7002614941d7	TCODE	PFCG	1
a6915485-939f-423c-9d48-c4305b0209d6	3693ebb7-ce17-40a4-b311-7002614941d7	TCODE	SU01	2
7890c92f-a495-494c-8fcc-e6fe2c4400f2	3b81e894-152b-47db-8199-079a20aa781a	TCODE	PFCG	1
df14ebd5-f398-46ce-96e5-d229997980b8	3b81e894-152b-47db-8199-079a20aa781a	TCODE	SM30	2
373dc669-fa57-4bcc-9ca0-dac7a1ba6328	5754f60d-81a8-46c2-bd21-14285025b84e	TCODE	PFCG	1
32103fda-eb54-4b97-ba0b-e26f95f8618a	5754f60d-81a8-46c2-bd21-14285025b84e	TCODE	SE16	2
f6608b02-07e0-40d3-a502-dcf42fe0e227	d032d91f-24f1-42c0-afeb-ca1d9608b647	TCODE	PFCG	1
72d7d99b-737e-40a0-9127-0bf704929f9b	d032d91f-24f1-42c0-afeb-ca1d9608b647	TCODE	SE10	2
f600e148-462b-4a4f-b373-b7139816fb19	45cc51d3-fd84-450a-a879-0642a3df0cff	TCODE	PFCG	1
46fbc2a5-4f3d-42bd-be64-71d06f3c91f2	45cc51d3-fd84-450a-a879-0642a3df0cff	TCODE	STMS	2
7b1263a8-1269-4a06-8ba2-2a97a27c06d7	bdd5bace-ca07-48a2-913c-132aa4cd1b5d	TCODE	PFCG	1
6f0cd801-9516-423d-b77f-c5993c2d5097	bdd5bace-ca07-48a2-913c-132aa4cd1b5d	TCODE	PA30	2
1089262c-d3b5-484a-bfd4-529657d38a41	09e06b2a-9fb4-448b-a527-11455aa540b4	TCODE	PFCG	1
2624b9b8-db7f-464b-972e-ec6a1cf20ea2	09e06b2a-9fb4-448b-a527-11455aa540b4	TCODE	PA20	2
fddedeaf-68fb-40f0-9fd7-0428f484ef6a	8c596dd6-34cd-449b-8181-c4bf5e07d970	TCODE	PFCG	1
92a0e42d-aecb-42b6-b344-81d86fc58197	8c596dd6-34cd-449b-8181-c4bf5e07d970	TCODE	PP01	2
ddbf8385-3569-4cdf-8715-7210d2e5c1c5	5f997153-5f22-472d-b07b-4fc65e408712	TCODE	PFCG	1
77aba63d-feb8-47e4-80c8-92f23f031c20	5f997153-5f22-472d-b07b-4fc65e408712	TCODE	PPOME	2
7b1d0f5d-246c-47f0-a86b-f3435f12cb25	82b6f4f0-35dd-428d-9750-0e615abf1171	TCODE	PFCG	1
2f806361-aced-4b46-b802-dc70dc086206	82b6f4f0-35dd-428d-9750-0e615abf1171	TCODE	PA40	2
af46c57e-49ff-43f2-a691-9b66b9171190	0dbdce62-8954-4076-ab4e-2b0be11288b5	TCODE	PFCG	1
01e200ec-9cd5-4957-bfc9-a5658cefdc25	0dbdce62-8954-4076-ab4e-2b0be11288b5	TCODE	PA70	2
a7fcef34-853b-4128-932a-7517ebd06853	a176a243-98c7-4685-911c-36b122cc8d58	TCODE	PFCG	1
5489de69-f0c3-41dd-85fc-858b46e94c3d	a176a243-98c7-4685-911c-36b122cc8d58	TCODE	PC00_M40_PREL	2
9f5daf54-c2f4-4c20-8805-9968ac018183	a7e83534-de7b-44f6-9d64-5830746c11aa	TCODE	PFCG	1
4e816d7a-cebf-4277-bb79-1d08e743067f	a7e83534-de7b-44f6-9d64-5830746c11aa	TCODE	PC00_M99_CALC	2
9c1067d7-83ac-48c4-b547-d88ee7ea1657	e5113501-693c-405c-8d7d-af49b552f0e8	TCODE	PFCG	1
019bc67e-8754-403c-b68a-d146034cabfa	e5113501-693c-405c-8d7d-af49b552f0e8	TCODE	PC00_M99_RUN	2
297164e7-1c7f-4497-b460-539160accf0e	4dd2fc1a-abee-442c-b43f-c37963b13f5e	TCODE	PFCG	1
8d569fa9-00ae-450b-b636-006dca52dcf7	4dd2fc1a-abee-442c-b43f-c37963b13f5e	TCODE	PC00_M99_PA03	2
45dbda98-8d1f-480a-845b-61e68b9c41b9	0cb992d7-3697-4b2f-a0ea-d554fc1af899	TCODE	PFCG	1
e9aaa038-2217-4142-aac6-0f197eb9b562	0cb992d7-3697-4b2f-a0ea-d554fc1af899	TCODE	PC00_M99_CLSTR	2
4901cdeb-8ee8-4729-8e2c-f2b75ff865e2	4e7400a8-56d8-401a-b9f8-77684ddae390	TCODE	PFCG	1
9f27120e-7b63-4e24-9318-5f28d1110440	4e7400a8-56d8-401a-b9f8-77684ddae390	TCODE	PC00_M99_TPRO	2
2b5ab085-bb9c-4ec5-8b1d-3889d75c8cb1	65c0a4b8-b653-4da9-b088-35d7d587b756	TCODE	PFCG	1
7331df06-7f4c-48d8-bd53-ddfa784949a9	65c0a4b8-b653-4da9-b088-35d7d587b756	TCODE	PC00_M99_PAYRUN	2
4602426a-733a-43b8-a849-e85ad75007d8	7507409c-d589-4003-9af0-a0d55ade280b	TCODE	PFCG	1
ecad9d23-3044-4fe8-ae56-ec56d7b3124a	7507409c-d589-4003-9af0-a0d55ade280b	TCODE	PC00_M99_DM_CREATE	2
a7c8718c-218d-4e0c-a38f-1d4d0288cb73	695555fa-0b1c-47a5-98f2-62f4e6c59404	TCODE	PFCG	1
ebc3bdf5-4f26-4073-b942-5519be022cef	695555fa-0b1c-47a5-98f2-62f4e6c59404	TCODE	PC00_M99_BANK_EXPORT	2
1990e888-ae54-4ded-868a-07989d51fe3c	ba8b82ce-8f5b-44e6-93a9-9cd4870e8256	TCODE	PFCG	1
14261d9c-ba78-4cd9-8bd4-fa93bb48e242	ba8b82ce-8f5b-44e6-93a9-9cd4870e8256	TCODE	PC00_M99_WT_CALC	2
06e6cb9b-4fec-40a6-b258-ce936110f72e	9fbe0fad-0451-47dd-89ee-3d17559aeb3d	TCODE	PFCG	1
e1d560eb-dc48-4aaa-aac9-e1a8dc20ee9b	9fbe0fad-0451-47dd-89ee-3d17559aeb3d	TCODE	PC00_M99_ACH_GEN	2
fe7b3475-d9ed-463c-b9c8-9bd3e4d3ffe9	004cffca-0daa-4f19-b2ef-9d20735a67ad	TCODE	PFCG	1
ce8cb309-e0f6-4e2e-b2c5-631f27bbc4e0	004cffca-0daa-4f19-b2ef-9d20735a67ad	TCODE	PC00_M99_SALARY	2
d1696ef1-ba67-42df-9509-b0179cd18aeb	a0a377b1-2c0f-4acc-8f41-9e80b494626d	TCODE	PFCG	1
839f7f04-ac82-43a5-a4dd-035f224831ca	a0a377b1-2c0f-4acc-8f41-9e80b494626d	TCODE	PC00_M99_BONUS_CALC	2
5a8b26ff-cc32-4fe5-a823-6baafeebed45	17a70478-07a0-4b7a-849e-b5230dd85c58	TCODE	PFCG	1
8eacddeb-9324-438b-8902-9632b2059787	17a70478-07a0-4b7a-849e-b5230dd85c58	TCODE	PC00_M99_STOCK_GRANT	2
3086bb1e-ecf2-4719-bb0b-65c018a04bd5	9df3774c-8c55-490c-b6aa-2273b39ad698	TCODE	PFCG	1
63ea6b20-1a7a-47de-839e-137c87dc3afb	9df3774c-8c55-490c-b6aa-2273b39ad698	TCODE	PC00_M99_COMM_CALC	2
9019743e-611c-4f95-9cd3-1421e1b4834e	d73acc8c-5d6a-4271-823b-ff4b0718e2d7	TCODE	PFCG	1
4892109f-7086-4007-a399-8fa1507ee71c	d73acc8c-5d6a-4271-823b-ff4b0718e2d7	TCODE	PC00_M99_INC_PLAN	2
55685a5e-3910-4a8e-ae69-3b44a2c3adf5	6760f39b-78f7-4acb-aecd-a8077206fb62	TCODE	PFCG	1
d3d67b0f-aaec-4c13-b899-5e01931b1a78	6760f39b-78f7-4acb-aecd-a8077206fb62	TCODE	PC00_M99_TIME_REC	2
7bbef054-f72f-4ea8-ae84-109e2542bc40	da6226a6-4577-4ddf-9522-e0f2ca5082f1	TCODE	PFCG	1
f17e8b8e-1b91-4557-9833-4501e49ebc8c	da6226a6-4577-4ddf-9522-e0f2ca5082f1	TCODE	PC00_M99_ATTENDANCE	2
ad5648cc-0b11-4326-a933-c5b197467c37	41dafec4-bef8-4261-9669-0b88f678d2e4	TCODE	PFCG	1
0238c66f-cae8-4914-b123-3bd05391c212	41dafec4-bef8-4261-9669-0b88f678d2e4	TCODE	PC00_M99_OT_ENTRY	2
5c9a0abb-6289-424b-b630-2e1b968887f3	0f31d459-cd4d-4a2e-8697-bd753ec4eaac	TCODE	PFCG	1
42845a9c-2bcb-4ba8-8891-2d6154e19285	0f31d459-cd4d-4a2e-8697-bd753ec4eaac	TCODE	PC00_M99_LEAVE_REQ	2
96272661-2623-4478-984f-e6324bfca2af	cbcd53a6-20d5-4eb2-b07d-f0182fc6e87d	TCODE	PFCG	1
0cdb1f10-3262-4c87-883a-1d1a8af3cb3c	cbcd53a6-20d5-4eb2-b07d-f0182fc6e87d	TCODE	PC00_M99_SHIFT_PLAN	2
d01f19dd-e707-4980-977a-982092e9a869	8d55524d-1e50-4614-9a6b-716e3a7a254c	TCODE	PFCG	1
d17a8e64-d97d-4a86-b95d-39786ea5fe86	8d55524d-1e50-4614-9a6b-716e3a7a254c	TCODE	PC00_M99_AUDIT	2
ff196d1d-d3cd-485b-ba92-96021084ac14	42ee7811-da67-4f09-95dc-5a1712d0696d	TCODE	PFCG	1
371a2bd4-649b-443f-aad1-1c49164ffcea	42ee7811-da67-4f09-95dc-5a1712d0696d	TCODE	PC00_M99_REPORT	2
901fbfc7-eb98-4c93-8c26-d4899d74c6e7	c7acbf45-e6c1-470d-ad3e-c1c07d8cde23	TCODE	PFCG	1
51d4adff-0e58-4fc6-acbc-bca60a16d945	c7acbf45-e6c1-470d-ad3e-c1c07d8cde23	TCODE	PC00_M99_MONITOR	2
fc954346-965f-4f67-a6ac-c729b7566dbf	916fae5f-e75a-4504-85af-11b472f48cfc	TCODE	PFCG	1
23abf631-cc4d-4c16-a8e8-b656e36be00b	916fae5f-e75a-4504-85af-11b472f48cfc	TCODE	PC00_M99_ANALYZE	2
94fd2730-f20a-4fd2-b1a0-fb36e46bec9a	1b6c5949-eb0f-42f7-a737-9644d205dca9	TCODE	PFCG	1
3dcc40a8-76a2-4f9f-89f9-f5c0825c7575	1b6c5949-eb0f-42f7-a737-9644d205dca9	TCODE	PC00_M99_EXTRACT	2
4267287b-7f4c-44b1-a4bb-7c00f7c6b589	f4ceacd1-4b83-44b1-a9c2-10f47c9944ac	TCODE	PFCG	1
e391492b-3388-47f1-af6b-e40003fd3854	f4ceacd1-4b83-44b1-a9c2-10f47c9944ac	TCODE	SPRO	2
206d3be0-a0a3-4502-8a1e-5577d5cf92db	12f6fd57-85fa-4349-a327-6693a6446a42	TCODE	PFCG	1
c6deaa85-fd0f-4b24-a29a-42b5e00b9822	12f6fd57-85fa-4349-a327-6693a6446a42	TCODE	PC00_M99_CUSTOMIZE	2
7b38f2d1-ebc1-4aa5-bb04-315317c26a3a	7b1e905c-5380-40e3-89c1-0b664782a35d	TCODE	PFCG	1
1f2a5a28-b53f-478c-8272-27fa3298903d	7b1e905c-5380-40e3-89c1-0b664782a35d	TCODE	PC00_M99_SETUP	2
b7152723-dffa-43a9-babb-005c6f22ceed	cd1080bd-a9a1-41dc-a242-7699cbeed79a	TCODE	PFCG	1
25069eaf-0914-49ba-844d-9e7b2fc52ed3	cd1080bd-a9a1-41dc-a242-7699cbeed79a	TCODE	PC00_M99_PARAM	2
c1513306-93ff-4ea9-a4fb-e031ceac135e	872af311-dad1-47e1-a69d-d90d5074a59a	TCODE	PFCG	1
58de6750-ca14-4f47-9652-27ac1bd152f1	872af311-dad1-47e1-a69d-d90d5074a59a	TCODE	PC00_M99_SCHEMA	2
7a4f7bf7-49cc-415f-9bd9-b5ffe877cc61	f8bbb749-3bcc-4037-a61d-7dac0ec6ae39	TCODE	PFCG	1
de1565e3-827e-48de-8342-7fc069cf68ae	f8bbb749-3bcc-4037-a61d-7dac0ec6ae39	TCODE	S_PH9_46000218	2
a2617509-aa25-49bf-804d-f2de1667ff99	eb93d63c-1177-451b-b72d-e8a89c3c7972	TCODE	PFCG	1
4d04b75f-351d-4fa7-91e6-46234142d645	eb93d63c-1177-451b-b72d-e8a89c3c7972	TCODE	S_AHR_61016354	2
65692242-3c8c-4dba-86c5-241018b38e07	4131a555-261f-445e-b18f-42a71a402bff	TCODE	PFCG	1
770ef367-48e1-476c-88a6-c9eabcc3acb7	4131a555-261f-445e-b18f-42a71a402bff	TCODE	S_AHR_61016362	2
b6f7bf44-a99a-4f13-a18c-dbb9e19af52d	52b35678-7f5d-497f-a576-2fef6c4c5ed7	TCODE	PFCG	1
bc5e1526-2b96-4255-af48-9b37013867da	52b35678-7f5d-497f-a576-2fef6c4c5ed7	TCODE	S_PH0_48000450	2
9f2a4482-728e-48df-8be9-d11b8a072e9d	26ff9fbf-e5fc-46e2-9b0b-3222a68f55b8	TCODE	PFCG	1
12800fd2-a1cd-4f82-8d57-742ea863839c	26ff9fbf-e5fc-46e2-9b0b-3222a68f55b8	TCODE	HCPT_MONITOR	2
bdb80226-0133-4687-aee6-6984c793adad	73a2ace3-27ba-4b53-9249-421cfe2b86cb	TCODE	PFCG	1
4993f0ed-ffb6-45e2-b50d-84217c575948	73a2ace3-27ba-4b53-9249-421cfe2b86cb	TCODE	PCL1	2
ad1c8a92-6067-4c12-b915-0600405d736a	ebce1550-a44f-4b87-a345-e6d4b51b4537	TCODE	PFCG	1
f337cf1d-356c-4bb8-97af-3f97407a77c5	ebce1550-a44f-4b87-a345-e6d4b51b4537	TCODE	PYXX_C	2
213c38b6-8272-4ff4-8526-84ab2db16ffd	23ed5a26-b9dd-4c4d-9f2c-4dcf2857c874	TCODE	PFCG	1
1c125636-5e4c-4bd5-a8fa-7329cc0b1982	23ed5a26-b9dd-4c4d-9f2c-4dcf2857c874	TCODE	RPCPCMP0	2
622c2760-59ee-4b40-8ee4-f024234b1baa	6e9dbde8-4258-4856-af1b-cec2abab1062	TCODE	PFCG	1
ca9aeb02-df47-471a-8684-e2f26712c2af	6e9dbde8-4258-4856-af1b-cec2abab1062	TCODE	PC_PAYRESULT_D	2
1e009cb9-c22b-4a80-8084-65d3d3d63863	838cee0d-eb0a-438e-adc7-1d54bc0fbeb3	TCODE	PFCG	1
1437aa9b-861c-4aa0-809c-d74e5a89c1d1	838cee0d-eb0a-438e-adc7-1d54bc0fbeb3	TCODE	PC00_M99_RETRO	2
345259fa-59d6-42a5-b121-29db841dc91b	777a17db-120c-44e8-a48c-6b3ab236aa9d	TCODE	PFCG	1
315a0df9-4bf9-4384-a0eb-f7bb91c8ec64	777a17db-120c-44e8-a48c-6b3ab236aa9d	TCODE	PC00_M99_TAXCN	2
d29d0e52-8997-4fbc-987c-b353d7d8dcaf	80443d5b-1722-4853-8dbd-ad765ace4db6	TCODE	PFCG	1
3dabc5d5-d7a8-46cb-b716-c07c0e511ca8	80443d5b-1722-4853-8dbd-ad765ace4db6	TCODE	PC00_M99_VACAT	2
c1526076-3b4c-4c0d-acef-cee0fd9bf311	83502333-df03-44a0-94c6-90d987bf39ff	TCODE	PFCG	1
8bdc17fb-b761-4517-831c-8a53a604c218	83502333-df03-44a0-94c6-90d987bf39ff	TCODE	PC00_M99_LOAN	2
ca881ae0-3fd0-4575-9c21-f47bb7274d81	cc06ead5-64a5-4f33-a0bf-0c3186752adf	TCODE	PFCG	1
fa5303c9-fc3c-4766-afaf-9ec3fc4eb8e9	cc06ead5-64a5-4f33-a0bf-0c3186752adf	TCODE	PC00_M99_PENS	2
68970204-d643-4d4e-b9e8-fc30315cf688	bf40ca9e-d2cf-4a2c-8ddd-c5deb1eee8a3	TCODE	PFCG	1
8e6b6332-a16c-4c10-892b-cd38f371a77b	bf40ca9e-d2cf-4a2c-8ddd-c5deb1eee8a3	TCODE	PC00_M99_MEDCL	2
2faac23e-ce18-4318-ab1e-539571d2ad07	cd193e3b-1db1-42e1-be72-ca8600bb4f56	TCODE	PFCG	1
282f5443-b508-4e2c-bea5-62f5d15e7796	cd193e3b-1db1-42e1-be72-ca8600bb4f56	TCODE	PC00_M99_ALLOW	2
cb7a3459-ac64-4d2f-a110-cd5f2eb74a88	d7aa7564-48df-412d-91df-8db5084e81c2	TCODE	PFCG	1
87b45195-5cf2-49e6-9cb0-abb73ef0a2de	d7aa7564-48df-412d-91df-8db5084e81c2	TCODE	PC00_M99_GROSS	2
220eafa8-4654-42f6-a4b2-4447996961b3	06a0b253-653b-4ccc-8f58-4226a72f4e5c	TCODE	SECATT	1
02fa34ae-6799-4aa0-937a-dac34309526c	06a0b253-653b-4ccc-8f58-4226a72f4e5c	TCODE	PC00_M99_PA03_RELEA	2
95732cd8-3d32-4835-ae29-717871ff7267	2b199fd3-4a2f-4742-b354-21fbbd7c4add	TCODE	SM18	1
16d6c43a-9887-4c34-9a07-53090364de05	2b199fd3-4a2f-4742-b354-21fbbd7c4add	TCODE	PA30	2
e831f387-7a66-47f9-a328-19a82409b461	2e62fe65-a636-4a89-aa25-6ef25381dbda	TCODE	SM18	1
e3bcfeee-2e42-4972-a796-503cc5bfbf26	2e62fe65-a636-4a89-aa25-6ef25381dbda	TCODE	PC00_M99_PA03_CORR	2
154fcbef-3025-493a-ad0d-240ce16d0f82	896ce5cf-d72b-402b-ac8b-e54a7be9421f	TCODE	SM18	1
b0667d0b-255e-4425-aa07-f6b68f7ad4de	896ce5cf-d72b-402b-ac8b-e54a7be9421f	TCODE	PC00_M39_CALC	2
a47ab43c-9991-4618-a00f-7af2e5d72071	d3dd9b16-ac98-4307-96ee-523bbb950c74	TCODE	SM35	1
d899e474-dc02-45aa-89d6-69b1c9ed169e	d3dd9b16-ac98-4307-96ee-523bbb950c74	TCODE	PA30	2
97e79d8f-5d1b-458e-832e-4dad8759bdfc	af6a4945-acc2-4cac-a81c-33ba1f176484	TCODE	SM35	1
2b868fdf-ebe2-4575-90f6-e0020ca54ad6	af6a4945-acc2-4cac-a81c-33ba1f176484	TCODE	PC00_M99_APPROVE	2
8680d83c-ccce-4ffd-8579-eb00c34d2d86	752717dc-4e0d-4eb8-8347-7100cd7f1d91	TCODE	SM35	1
4af6023e-b8d4-49b5-ab5b-9e8b4f9febc5	752717dc-4e0d-4eb8-8347-7100cd7f1d91	TCODE	PC00_M99_PAYRUN	2
579dce7f-b1df-4ad2-950e-534ec939d529	aa436357-e18a-4a3f-bffc-09fe888424fa	TCODE	SU01	1
2b0e83db-c878-4a2a-9ee2-48f6b1e344d6	aa436357-e18a-4a3f-bffc-09fe888424fa	TCODE	PA30	2
29bbf806-5af3-4890-9f47-8d5719b4e51a	95e96c74-641a-440c-bc0f-ddf78d284bc2	TCODE	SU01	1
252f96a0-34e0-4861-817e-473edf1ed531	95e96c74-641a-440c-bc0f-ddf78d284bc2	TCODE	PC00_M99_CALC	2
69c7e950-e5a5-41d5-abb6-7a21aad474a7	8592d5f5-6997-4f74-85c3-5bd682f6a04f	TCODE	SU01	1
7e9537da-b901-4cda-afcf-643609cb47e6	8592d5f5-6997-4f74-85c3-5bd682f6a04f	TCODE	PC00_M99_PA03_RELEA	2
70b26400-a0d5-4232-83aa-b06891dc6162	c1cd067f-b412-44d5-a8a3-87676f03168f	TCODE	PFCG	1
b9753dde-0bf1-4f81-8d8c-125beffe7da7	c1cd067f-b412-44d5-a8a3-87676f03168f	TCODE	PA30	2
ddb1cc59-5619-4259-865b-485f9915ebe9	069040b1-5485-4434-a5e4-980621214900	TCODE	PFCG	1
49a78c4b-f83f-42d2-a915-c04337094aec	069040b1-5485-4434-a5e4-980621214900	TCODE	PC00_M99_APPROVE	2
07203df1-f290-4e57-bfcd-20f721abe705	805ce5f0-0c2d-46ce-bef0-5f43aff37513	TCODE	PFCG	1
a1cd1eb3-9ce9-4ae4-a715-a874737748b3	805ce5f0-0c2d-46ce-bef0-5f43aff37513	TCODE	PC00_M99_PAYAPP	2
d65d1bd9-397e-45d2-bdc2-234e6145972e	2baad4a9-d62e-4bb3-bfd1-21bcd33407f0	TCODE	SM30	1
e46f6176-ba44-4d93-8cfe-00880a121d67	2baad4a9-d62e-4bb3-bfd1-21bcd33407f0	TCODE	T500P	2
a054a2ed-bf60-4601-b9a4-51ace5237afa	24d82acf-a116-44f6-baf2-f8984dc8abbd	TCODE	SM30	1
cdcf44b1-3ff4-42de-bd2b-1fff7ff800ab	24d82acf-a116-44f6-baf2-f8984dc8abbd	TCODE	T549A	2
cce1466d-da67-4c73-b896-5de9be43b32e	225f6370-4b94-43ec-8202-b783e5e3b791	TCODE	SM30	1
01fcf309-3fb0-4a69-8da5-f910f975a2fc	225f6370-4b94-43ec-8202-b783e5e3b791	TCODE	T52C9	2
d05688ff-fb75-45d5-a9fb-626be316521f	e13ba2f0-dea0-46b5-a9ad-d14fa520838a	TCODE	SM30	1
345de6c1-8e3f-4e27-985a-e95cb1ee2687	e13ba2f0-dea0-46b5-a9ad-d14fa520838a	TCODE	V_T511	2
6483994b-b8c1-4a3b-9946-d86d2dd101b9	1daf9dc7-18e0-4cb0-9ca2-4d16fc60dfa7	TCODE	SM30	1
1e248397-c0de-4107-bfc1-dd3ce4d6e9cf	1daf9dc7-18e0-4cb0-9ca2-4d16fc60dfa7	TCODE	V_T588M	2
7d2999ce-df0d-4451-9043-c1c2016b7d3b	11c40c98-98b3-42f6-ab8c-7faff3d8d988	TCODE	SE16	1
578645d9-f91e-4f31-b90d-58fd2cb8aec1	11c40c98-98b3-42f6-ab8c-7faff3d8d988	TCODE	PA0001	2
d93f3a3c-88b4-4b15-ba9e-ecf63163aa7b	0d3dc1e1-b569-4d05-81e5-09d988768f0c	TCODE	SE16	1
f8132add-c2a9-4ca9-94d4-5c99da18ccea	0d3dc1e1-b569-4d05-81e5-09d988768f0c	TCODE	PA0008	2
6584538b-be1b-4659-8004-a77f770c0431	78684a8d-d267-47e7-9887-963750d19227	TCODE	SE16	1
b26939e2-8875-4903-98f6-2d87fe513acf	78684a8d-d267-47e7-9887-963750d19227	TCODE	PA0009	2
a9b76c03-f208-4fc2-b719-d6fa0b83f437	0460e0ff-8d07-4872-9b0b-57446583a188	TCODE	SE16	1
d422a9f8-c8b9-440e-a16a-273bbd3041e7	0460e0ff-8d07-4872-9b0b-57446583a188	TCODE	PC_RESULTS	2
b9891cc7-f7e6-4dd7-8abd-ccd268f936f3	eda5aca9-3c4b-42e4-b75d-bc0a1477a212	TCODE	SE16	1
6debfe2a-4e06-492a-a6f0-03374e954406	eda5aca9-3c4b-42e4-b75d-bc0a1477a212	TCODE	PC_EVALUATION	2
f924f26c-599e-4fce-8b17-2098464cf201	e6ef3ed1-bc7a-4db6-afce-1cd2d172d0d7	TCODE	SE10	1
71b02321-c97c-4de2-99c8-599f78267f4d	e6ef3ed1-bc7a-4db6-afce-1cd2d172d0d7	TCODE	PA30	2
6d266653-fa19-4b8e-913d-6278c1b00b6b	346d72ad-6ac7-4578-866c-2ab4638f5f73	TCODE	SE10	1
82c09e5c-7833-4e96-82da-25a7be834b04	346d72ad-6ac7-4578-866c-2ab4638f5f73	TCODE	PC00_M99_CUSTOMIZE	2
0f809ca6-f101-496b-be48-7715c5a54315	418ff229-b1a0-4b2c-a918-1716bba38c54	TCODE	STMS	1
315a3e4c-8550-41bc-aa6c-a7444b374cdc	418ff229-b1a0-4b2c-a918-1716bba38c54	TCODE	SPRO	2
961ca9e2-dbbc-4330-b280-6466706a46c7	578a9c65-d50d-4d96-ab09-a8886ab5fc27	TCODE	STMS	1
f0e2f217-d0d9-46c2-8614-03ef3f342efb	578a9c65-d50d-4d96-ab09-a8886ab5fc27	TCODE	PC00_M99_SETUP	2
7f48baa4-1845-49d6-b25f-c3de27990d37	5daeaafb-ee6e-4622-81ea-ce8944c3c78a	TCODE	PO03	1
cbd54b6d-24a4-4327-b157-e68c9da1c02b	5daeaafb-ee6e-4622-81ea-ce8944c3c78a	TCODE	PA41	2
eadc4df5-78de-4f7b-b28b-1386db829064	bef21342-17fa-4ec9-a0ac-10dedddc71d2	TCODE	PPOC	1
4b441b91-f7bf-4339-89a5-02abdfc03ed0	bef21342-17fa-4ec9-a0ac-10dedddc71d2	TCODE	PPOC_OLD	2
cd1d4d34-f352-4d26-a5bf-752cc30f6340	9c66a1a6-b62b-4b85-b33c-53de6e5cf835	TCODE	PPOM	1
3b490034-f6f7-4d68-8430-fcd65cb26028	9c66a1a6-b62b-4b85-b33c-53de6e5cf835	TCODE	PPOM_OLD	2
d9160294-0ced-49e5-b1dd-fe262665e80a	563bc34a-63c7-423f-b2e6-974c15b2764c	TCODE	PE01	1
93d369ee-05eb-4b5c-a813-33f9536ca323	563bc34a-63c7-423f-b2e6-974c15b2764c	TCODE	PE02	2
3843508c-b84a-48c6-b082-ae713f1d78b0	087b41c6-33d0-4a76-b3ad-06182782c869	TCODE	PE01N	1
4757dc6c-7f4d-4a39-8d6e-ad684baea9ef	087b41c6-33d0-4a76-b3ad-06182782c869	TCODE	PE02N	2
0ee9322c-6c0e-48c3-8006-ed46134f3815	c4a8a33a-82a0-4bc1-b09b-2a6e14dae39e	TCODE	PT01	1
01660797-9e72-439a-8464-5ba1f4f7bc9d	c4a8a33a-82a0-4bc1-b09b-2a6e14dae39e	TCODE	PT02	2
2c44b3c7-d32a-4edd-9180-b484928bf235	870dd2df-454f-4e19-99d5-144336e07402	TCODE	PA41	1
fca6cd04-21c5-436e-ac3a-0580b3386840	870dd2df-454f-4e19-99d5-144336e07402	TCODE	PA61	2
6e8b3c88-acf5-478c-b94f-a32aeb223cb7	b403e1d1-cbb9-453b-aa27-baa535aa7066	TCODE	PA42	1
f5280f4a-ec27-4aad-a5e1-481170f580a6	b403e1d1-cbb9-453b-aa27-baa535aa7066	TCODE	PA62	2
5996d93c-0229-4f8e-8eab-402dc5da07db	ec3daa39-8eea-47aa-8065-7ce8323abcfb	TCODE	PA03	1
41a4ea7d-f485-4f07-a7ea-57202cb2c7a7	ec3daa39-8eea-47aa-8065-7ce8323abcfb	TCODE	PP6A	2
fadb2b84-8335-48db-b021-54e99e9539d8	b9b7c8f1-55e2-4a91-8f26-c01996a26dfe	TCODE	PP6A	1
aee7f90c-1e8f-403d-b89b-0d01640a2483	b9b7c8f1-55e2-4a91-8f26-c01996a26dfe	TCODE	PP6B	2
c8a6190d-8d8f-4fba-8636-91bb376f2e6c	39e5b300-d9a1-458f-b088-afe4199255d8	TCODE	PP6B	1
d7108e2e-0ec0-4022-9daf-2b4b4214a7fa	39e5b300-d9a1-458f-b088-afe4199255d8	TCODE	PP6C	2
2372f3a8-3268-4a2a-b448-9547272d5fc6	2f6ca006-fe1f-4dc6-9fea-17c085828ca4	TCODE	CAT2	1
a6453cab-9246-45fa-8599-6e215f7a5117	2f6ca006-fe1f-4dc6-9fea-17c085828ca4	TCODE	CAT2_ISCR	2
0f4ddd76-c980-415c-9334-87ccaca933a0	25d9029b-52c0-4e2c-bc16-088a4cad7d38	TCODE	CAPP	1
63431dfd-f8b0-46b2-9a1c-4fb530186e0a	25d9029b-52c0-4e2c-bc16-088a4cad7d38	TCODE	CAPS	2
2592dfb6-db8d-49e5-8dad-9057d24895ef	99a435ce-643a-427f-89f4-2ca2645ae72b	TCODE	PC00_M99_CWTR	1
7f0b5674-7bf7-4d00-a19d-7c3455dbc2ab	99a435ce-643a-427f-89f4-2ca2645ae72b	TCODE	PC00_M39_TRM0	2
a3d37abf-a250-4eab-bd23-48ddf3630d9f	e59301e4-377f-4666-b99b-fc060f58cc3e	TCODE	PC00_M39_RPRV	1
a06bc373-9d13-46e7-8c08-c656afb1279f	e59301e4-377f-4666-b99b-fc060f58cc3e	TCODE	PC00_M39_RINE	2
16e97cd4-fc14-4502-8f74-4843a04a7f33	02a2ba23-f5d4-47cd-9fd4-d8290503f4b9	TCODE	PC00_M39_LRE	1
90c2640f-ce84-4644-b668-f057936cd83c	02a2ba23-f5d4-47cd-9fd4-d8290503f4b9	TCODE	PC00_M17_FFOT	2
748dc84c-3a94-481f-b99e-125ba902ad0b	21d0d5c1-6b61-43c1-9b47-ba11b10472c9	TCODE	SM31	1
475d130f-3c66-4545-b831-fc8804c3739c	21d0d5c1-6b61-43c1-9b47-ba11b10472c9	TCODE	SE16N	2
1989e4e4-f0ab-4541-bd8f-350de08e31e8	3351abb4-ed2d-4c68-9ef3-92310c4974f7	TCODE	S_AHR_61016510	1
779200ef-25d2-4115-b1c6-c70170f96cad	3351abb4-ed2d-4c68-9ef3-92310c4974f7	TCODE	S_AHR_61016528	2
c3893f4a-9c97-43f6-8c71-629ecd60e9a5	223972a8-7b98-4962-a7b6-2f734ae1b791	TCODE	PTMW_TIME_ADMIN	1
7699b67c-fe2c-4225-a6d9-8d0e556d9de5	223972a8-7b98-4962-a7b6-2f734ae1b791	TCODE	PTMW_TIME_ADMIN_GRP	2
48568ba4-8bab-44db-a290-34e65f43a127	3dca6a38-6a82-4788-9812-16237bdd6207	TCODE	AL11	1
57050bec-2ea4-4588-96a7-32eca7c6ef5b	3dca6a38-6a82-4788-9812-16237bdd6207	TCODE	Cualquier transacción de aplicación	2
e9b6db97-5f3e-4521-bfeb-7eb77a68a1b5	445c8cae-688b-42bc-8673-ec4f8cca735c	TCODE	FBPM	1
e63b9ec0-f585-4a32-b77f-cef0c41e947a	445c8cae-688b-42bc-8673-ec4f8cca735c	TCODE	PCP0	2
d418059f-df03-4914-88b6-20c4e5239267	7089652c-2dce-488c-9d4b-27d77416bf77	TCODE	HRCMP0080	1
fe744ba3-5915-423b-9d21-dc83154e0dff	7089652c-2dce-488c-9d4b-27d77416bf77	TCODE	HRCMP0081	2
c5bdf74b-7b84-4578-bb55-2c2b7cacf410	2d641d82-2a5e-41b1-9426-b80e3683778a	TCODE	OH11	1
cb26ca58-3ae4-49c9-b8fe-39c860d99458	2d641d82-2a5e-41b1-9426-b80e3683778a	TCODE	PC00_M99_CIPE01	2
65a99846-a285-498f-b4c8-fa3b745fa080	9112f0fc-03b7-4002-af48-793633f951af	TCODE	LSMW	1
b93f1865-7635-4d0c-95d8-a7746c9ca322	9112f0fc-03b7-4002-af48-793633f951af	TCODE	PP6B	2
4fb625d8-b73e-4f78-8f02-f30a4f34e14d	83c6eff5-0959-4b1f-9a22-7bdaed1e4381	TCODE	PC00_M99_CDTA	1
132422d3-6ac3-45c2-bd13-64cda726ec49	83c6eff5-0959-4b1f-9a22-7bdaed1e4381	TCODE	PC00_M99_CEDT	2
fb939d0a-9a8d-4e67-b131-68b1b917bdbc	c99c821e-8721-419e-bfa6-8d489efa1828	TCODE	PU03	1
1ae89eb3-1cee-42c1-94e6-99e9ce23b9b0	c99c821e-8721-419e-bfa6-8d489efa1828	TCODE	SM31	2
ff8bbbf1-f00e-415d-974d-8fb937b7c449	78ea0de9-b390-4d5c-829a-a7e860de16e5	TCODE	PP02	1
3ac365d6-b2fa-4582-8d29-936fd726c34a	78ea0de9-b390-4d5c-829a-a7e860de16e5	TCODE	PPME	2
2f80bc50-6462-4bc7-b7f8-e478c157dc23	c35cce0f-57ab-40f4-8e5b-e034ec960799	TCODE	RE_RHBEGDA0	1
9fb19947-cd5e-4e1c-a8d0-071f237a6ceb	c35cce0f-57ab-40f4-8e5b-e034ec960799	TCODE	RE_RHGRENZ4	2
b67999e8-9926-4b1b-9109-d46440be1d76	388e1981-70d7-42aa-904e-023a6dc99ca5	TCODE	PO01	1
83aa2c31-43ff-47d0-9e4e-c3636a2c7cff	388e1981-70d7-42aa-904e-023a6dc99ca5	TCODE	PP6B	2
1267e5d2-0d60-4a17-ae14-34cb6ada6b2d	020a1a22-8b12-467b-8d86-495d04021c94	TCODE	PO10	1
72fe6c1b-6f94-4fd4-94c8-d1643ada8222	020a1a22-8b12-467b-8d86-495d04021c94	TCODE	PC00_M99_DKON	2
97d63789-9a05-4405-8634-598780ff4689	2a22af63-dc1f-4424-aaf9-2072d218d2ce	TCODE	PE04	1
626ab917-6c43-4430-921f-987943e10b3c	2a22af63-dc1f-4424-aaf9-2072d218d2ce	TCODE	PPSC	2
3626fd02-528d-4a09-a8bf-4e2d68f8d44d	10daaef1-1417-4a3b-8987-8fec245219dc	TCODE	PP02	1
8653e5fe-365e-4497-b1ff-c91593d2d8a9	10daaef1-1417-4a3b-8987-8fec245219dc	TCODE	PPOMW	2
d341b16e-7e35-4437-818c-300e124afc02	3b28538a-e4df-4e02-8ff1-05ba904bbdbc	TCODE	PA71	1
801bbc84-132a-4656-bc2a-43f18071b218	3b28538a-e4df-4e02-8ff1-05ba904bbdbc	TCODE	PT50	2
470536d1-6c84-42aa-8c34-486c31aa4949	fed59ca0-f63b-4761-aee2-42e0c9f164a6	TCODE	PFOM	1
bb46d224-f59e-416a-a05e-f71b46b98470	fed59ca0-f63b-4761-aee2-42e0c9f164a6	TCODE	PC00_M99_CWTR	2
08e0accc-e228-40de-b7c8-a7994d0af5ac	41f05240-da1e-491f-82b8-a3152546985d	TCODE	PRMD	1
545dccd3-5ce2-4b95-a009-bb84a9432882	41f05240-da1e-491f-82b8-a3152546985d	TCODE	ECP_001	2
cf3185f7-bb1a-469a-9fa7-17a2a64859a8	2011c92f-94e6-42e3-82e8-73ef9aa609ea	TCODE	PU00	1
1483e75b-6fda-41ba-8391-d3b8ece4e4ec	2011c92f-94e6-42e3-82e8-73ef9aa609ea	TCODE	LSMW	2
8c024146-deed-49db-8071-d452ceda4c9f	e176db5a-23ed-4290-a730-930a821bc45f	TCODE	PA41	1
5c5fd3a0-8c08-4c20-ba3c-36be69eed1a8	e176db5a-23ed-4290-a730-930a821bc45f	TCODE	PO03	2
66b984a0-bd05-4d48-a9d3-41c313525803	02e80164-c327-48cb-bd54-7f2f816b250a	TCODE	PPOC_OLD	1
07d8e123-6825-4e09-a2a1-9cd674791410	02e80164-c327-48cb-bd54-7f2f816b250a	TCODE	PPOC	2
bcf47011-7314-4904-8ecb-e3365de28f9b	7718bddc-3e08-4e5f-a61f-517ea579471f	TCODE	PPOM_OLD	1
88c70553-97d9-4ca1-962c-558843fb0bd6	7718bddc-3e08-4e5f-a61f-517ea579471f	TCODE	PPOM	2
36fc6b12-eb43-4d50-88c7-643c5f361226	a8b70fa3-983a-4cb8-a697-b59b8a4a88f4	TCODE	PE02	1
537174a7-3010-455b-8379-d89080780664	a8b70fa3-983a-4cb8-a697-b59b8a4a88f4	TCODE	PE01	2
ed2db588-c297-4127-bc09-6a9e3f3ca445	a94ed8a4-2eca-44f9-b6da-12ce07d94339	TCODE	PE02N	1
c7cb788f-149b-484e-bf3f-ede0bc12d463	a94ed8a4-2eca-44f9-b6da-12ce07d94339	TCODE	PE01N	2
ff78e520-1c1f-4563-a5ea-b84fc9fba7b0	f8c692cf-cb36-4134-99f2-642e3a92051f	TCODE	PT02	1
f32e1732-5c4c-44ad-9dda-394c65513d43	f8c692cf-cb36-4134-99f2-642e3a92051f	TCODE	PT01	2
2d355d83-bdcd-49bb-a5f2-8c222b97af18	bcae2fc8-d0fa-4642-aca0-41dbb8975bff	TCODE	PA61	1
6ca4ecb5-926d-48a4-9711-10a72d0019ca	bcae2fc8-d0fa-4642-aca0-41dbb8975bff	TCODE	PA41	2
8a4048d3-65ad-48f2-bccb-a4afc64ac959	bf96f32f-e831-489d-9cac-0617b4af89b8	TCODE	PA62	1
6371f10b-b2ea-41c1-a242-d9450f3b5b2b	bf96f32f-e831-489d-9cac-0617b4af89b8	TCODE	PA42	2
5354c980-ba0b-4921-8a17-c103f80adadb	7f440683-73ac-464d-beeb-d30ef2802f10	TCODE	PP6A	1
61dda617-fbb9-412d-9462-445115950477	7f440683-73ac-464d-beeb-d30ef2802f10	TCODE	PA03	2
1fa553ea-eb91-42ca-b72c-040236017cf5	5e582ea5-c980-408b-926e-c3ad36b2a2c8	TCODE	PP6B	1
e34e3e79-dcf8-4d82-a016-56c08ba950ec	5e582ea5-c980-408b-926e-c3ad36b2a2c8	TCODE	PP6A	2
d371ff49-67b3-48b0-bb75-7560e82e28d2	a3c8a0dc-1e74-4673-ac7c-acd453942411	TCODE	PP6C	1
f47c7e27-4897-4954-8eab-1000a9793a84	a3c8a0dc-1e74-4673-ac7c-acd453942411	TCODE	PP6B	2
59047ee6-17f1-4532-b428-f07577d4efb2	3d2c1cb0-dc58-4cb4-9dce-b2c39d251f20	TCODE	CAT2_ISCR	1
43ee04a7-9fec-446e-be32-8da7db3127aa	3d2c1cb0-dc58-4cb4-9dce-b2c39d251f20	TCODE	CAT2	2
4db7b26e-59f3-4c55-98a9-1e5fd514c569	2f057a26-6581-45f0-ad25-637ac74ffe29	TCODE	CAPS	1
5495bd12-be92-4ef0-b506-621d5e45bbed	2f057a26-6581-45f0-ad25-637ac74ffe29	TCODE	CAPP	2
79e3c810-fd08-4791-8070-7c4c38a73d30	498da3a8-e68d-4f54-9d92-ceff56fc2faa	TCODE	PC00_M39_TRM0	1
d2bb0695-3419-49e8-b500-4a6e9f6c1767	498da3a8-e68d-4f54-9d92-ceff56fc2faa	TCODE	PC00_M99_CWTR	2
14523049-25a5-44fe-b081-8d7cfcf0e34e	f6d22e6e-8ec7-4a7a-823c-b084e8b7a686	TCODE	PC00_M39_RINE	1
2afb65b3-a898-49a9-96e5-eeb6d8a3faee	f6d22e6e-8ec7-4a7a-823c-b084e8b7a686	TCODE	PC00_M39_RPRV	2
596a6570-d2ec-44a1-ba80-ee80b825afc6	c777acbe-4826-49b6-ab3c-b575a245cf50	TCODE	PC00_M17_FFOT	1
11744e9a-229d-4d28-8635-afc8dea63f6a	c777acbe-4826-49b6-ab3c-b575a245cf50	TCODE	PC00_M39_LRE	2
110711e6-e29f-47a4-9e62-435a83ba69ec	695cd62e-4c74-4a7e-aabb-97d9c8573bc4	TCODE	SE16N	1
22bdefaf-6657-49bd-a347-7fc4fa3b203f	695cd62e-4c74-4a7e-aabb-97d9c8573bc4	TCODE	SM31	2
7a436a5b-5d0c-4cb6-b6fe-ba1f8ecfeebb	1cd5baef-ccf6-4dd7-8fdb-b12bea0fa478	TCODE	S_AHR_61016528	1
f77c541e-5461-4e66-b071-a8b76903dcc6	1cd5baef-ccf6-4dd7-8fdb-b12bea0fa478	TCODE	S_AHR_61016510	2
ff990e27-ccf9-41dd-a3d5-571fc32e23fa	b8d80755-b0b2-4ebd-bbc0-4628d64e06f1	TCODE	PTMW_TIME_ADMIN_GRP	1
7f5a5b48-d6fa-424b-889d-9ff4a29f54b3	b8d80755-b0b2-4ebd-bbc0-4628d64e06f1	TCODE	PTMW_TIME_ADMIN	2
62f58588-7798-49b6-8224-0f999ea73f55	32c039d2-7d4e-4275-a3de-bac5c4727f40	TCODE	Cualquier transacción de aplicación	1
02ae022f-c7ca-43de-8569-0b37736e778d	32c039d2-7d4e-4275-a3de-bac5c4727f40	TCODE	AL11	2
edf52775-fce0-45db-af91-cf2d679e4b3d	3225afe6-136e-467b-b1e9-fed755fdff75	TCODE	PCP0	1
a39221fa-59dc-4ba2-b3b8-1528ae50e1d9	3225afe6-136e-467b-b1e9-fed755fdff75	TCODE	FBPM	2
0ec1d064-9fa0-47b0-a884-6b426e036572	daffdb0a-f9a3-4351-9c3a-ddaa912bddd0	TCODE	HRCMP0081	1
f85151de-4baf-4878-a4d0-df6ac54732e6	daffdb0a-f9a3-4351-9c3a-ddaa912bddd0	TCODE	HRCMP0080	2
e5f03e48-3d4a-4a4c-ae0a-59ba29724382	493e94f3-4710-4299-8829-6bd5874ddf55	TCODE	PC00_M99_CIPE01	1
feb2f0c5-6b8d-4927-90f2-12f282eb1a20	493e94f3-4710-4299-8829-6bd5874ddf55	TCODE	OH11	2
dadd1563-0fb7-4a50-9f01-c1c94097571c	4d9476b0-5bee-42cb-84e4-6385dc7f7b49	TCODE	PP6B	1
3e1b1620-f26b-4e1d-a5d9-034e7877e746	4d9476b0-5bee-42cb-84e4-6385dc7f7b49	TCODE	LSMW	2
b6dcc46a-97d1-4e23-84d4-78d77ab4ed07	18c24e1d-7ceb-44f1-97b7-dc223ab4fb7c	TCODE	PC00_M99_CEDT	1
245866a2-58b8-47c8-aae1-93fb33da1103	18c24e1d-7ceb-44f1-97b7-dc223ab4fb7c	TCODE	PC00_M99_CDTA	2
980b7451-280c-4a2d-bb84-3b4dbf8c384d	97ab3b01-4c8e-4d9e-bc0b-3cedad5a10de	TCODE	SM31	1
ba87b364-b569-4976-a1cc-9ce280fca511	97ab3b01-4c8e-4d9e-bc0b-3cedad5a10de	TCODE	PU03	2
0be84cc1-6cd1-4adb-a752-3e110fca39bf	ad2d6041-9b3b-4b30-a9e0-192eb3994aea	TCODE	PPME	1
0eaea3ee-7a58-40d0-8097-32f712409163	ad2d6041-9b3b-4b30-a9e0-192eb3994aea	TCODE	PP02	2
a87202c9-a5c3-4cb6-ba06-ec409e5a4812	e33ac8c0-6272-48f3-89f7-5455f3f9504e	TCODE	RE_RHGRENZ4	1
02c0538b-86a6-42ad-88c6-33dced015d88	e33ac8c0-6272-48f3-89f7-5455f3f9504e	TCODE	RE_RHBEGDA0	2
e76c5670-cd30-4c4f-ae84-5bbaf5dc9e85	33716786-f574-4030-8ee7-34f6b2ff6b76	TCODE	PP6B	1
ed6b40ac-c5cd-4282-885b-5e84039fcab9	33716786-f574-4030-8ee7-34f6b2ff6b76	TCODE	PO01	2
8f21e4b9-6d56-4fb7-b19b-7f2c17a84331	e5fb6364-3b8a-4d22-bb07-400bb74a8479	TCODE	PC00_M99_DKON	1
a73471db-882a-4a52-813b-f37937c84cbc	e5fb6364-3b8a-4d22-bb07-400bb74a8479	TCODE	PO10	2
29cac209-452f-46b6-8f49-300379dba892	19d8bed7-18fc-4426-8241-5a02cc391bea	TCODE	PPSC	1
cb356aae-4756-4586-9692-34989762f415	19d8bed7-18fc-4426-8241-5a02cc391bea	TCODE	PE04	2
523f474b-8500-4ad3-9e7f-f8ea2543221c	056c3fd0-ccad-4e3f-b3f2-bb526422a02e	TCODE	PPOMW	1
075a15a3-1f7c-4ce2-b5cf-1044c0e1dc5e	056c3fd0-ccad-4e3f-b3f2-bb526422a02e	TCODE	PP02	2
e18e6cb9-c1fa-4cb1-9bb5-dbbec61a1f5e	438ec033-eba8-4ada-bf84-57a994ad5563	TCODE	PT50	1
e7eeff62-81e0-4bd0-90e1-99cb0ca9cee6	438ec033-eba8-4ada-bf84-57a994ad5563	TCODE	PA71	2
de59bfcf-84d4-4962-afd1-785ed7679726	18544c3f-262f-4fe9-87d6-4161e9f6a85b	TCODE	PC00_M99_CWTR	1
10356ee2-60c1-4877-af7f-c5055462a36f	18544c3f-262f-4fe9-87d6-4161e9f6a85b	TCODE	PFOM	2
72231ab5-26bb-4176-85f0-7421575f5ce1	42cd2925-a277-4475-a2b7-9f8da9bf0e4b	TCODE	ECP_001	1
54ce2895-8cff-4cad-8708-587ec2e8f029	42cd2925-a277-4475-a2b7-9f8da9bf0e4b	TCODE	PRMD	2
10040b08-f22e-497e-9a97-20475be912bf	937d22b4-059c-48ce-9816-40a4edda17f4	TCODE	LSMW	1
ab946be1-c3eb-4010-93c1-2ad00df2488f	937d22b4-059c-48ce-9816-40a4edda17f4	TCODE	PU00	2
d67cff34-1fcb-4afb-9669-ab48217d85d1	6c154390-ee53-4390-b149-72bb19438c29	TCODE	PA70	1
4f97b93b-1d21-413c-a975-5c6203f44bfc	6c154390-ee53-4390-b149-72bb19438c29	TCODE	PA03	2
18513519-999a-4320-a1ba-6f1946b3b804	2914e164-c272-4f6a-a06d-6a9d16b16ec3	TCODE	PA70	1
37d9f645-07fb-42ea-aaa8-f45095b73337	2914e164-c272-4f6a-a06d-6a9d16b16ec3	TCODE	PC00_M99_CALC	2
b748da2f-d760-476f-8a12-6d5f3ce3d05a	01f0034e-99c8-400e-a637-a1025b746a64	TCODE	PA70	1
f8c24a81-d165-40e1-a822-966539ac95c1	01f0034e-99c8-400e-a637-a1025b746a64	TCODE	PC00_M99_PA03_CORR	2
78380041-0ecc-4d69-a627-04a74992ecc2	e897a5c4-7690-4ba9-811e-929a165e689b	TCODE	PA70	1
07cb8c76-6eb0-4d2e-a894-410633c7cf54	e897a5c4-7690-4ba9-811e-929a165e689b	TCODE	PC00_M99_PA03_END	2
556f3805-0677-4a38-88ba-2fa5e3cb8611	b04ae505-9ff1-4d1b-9a4f-35b0bfdf8b11	TCODE	PU03	1
11898250-c38f-4580-8fba-f56011cc4ad2	b04ae505-9ff1-4d1b-9a4f-35b0bfdf8b11	TCODE	PA03	2
6b3a4ea1-32c9-4395-b4b1-2a893674130c	fc839134-b992-4adb-b698-1702be0ce15f	TCODE	PU03	1
b5f98804-ddc1-487b-ab24-ce84e4f67d3b	fc839134-b992-4adb-b698-1702be0ce15f	TCODE	PC00_M99_CALC	2
e0fe16a4-3e6d-4ffc-9595-4b5dda2b578f	a3fda470-f233-455f-835f-b4ab6b6e357e	TCODE	PU03	1
f78aa3ab-8c2f-47c6-8e59-fdbe6b31c7f8	a3fda470-f233-455f-835f-b4ab6b6e357e	TCODE	PC00_M99_PA03_CORR	2
db764a2b-aecd-4f49-b5e5-2e91893450ec	182cbb7e-10b5-4df4-a964-7492262e504e	TCODE	PU03	1
ffa34d6e-c558-433f-a3e1-e7b62d04b7c4	182cbb7e-10b5-4df4-a964-7492262e504e	TCODE	PC00_M99_PA03_END	2
27654984-0148-442c-afa3-4a157574a616	076169df-2e9d-42d1-a114-4863f31510b0	TCODE	PA61	1
10f79c9a-0e3d-4f11-815b-8e6f3e45ff7f	076169df-2e9d-42d1-a114-4863f31510b0	TCODE	CAPP	2
7b0b5f4f-7a2d-48cf-abd5-a11db702d4ba	cb132203-112c-4ab5-aa5c-6011c1adc700	TCODE	PA61	1
1f908e93-d5ef-4932-aea3-832cb012e568	cb132203-112c-4ab5-aa5c-6011c1adc700	TCODE	CAPS	2
1a4fa202-8660-4a98-bf91-55d6a2121756	89cab0d7-78cf-47fc-bc1e-03a5f1d70eed	TCODE	PA61	1
6db7863d-cca2-4362-bdeb-5ca4e251f4d6	89cab0d7-78cf-47fc-bc1e-03a5f1d70eed	TCODE	CAT4	2
7db416e8-9cf0-4b24-9449-0bc348685292	ab259791-f4e8-4b32-a859-1fdd9ea90a90	TCODE	PA62	1
c6b24207-7ea6-44a7-8583-5d177336896c	ab259791-f4e8-4b32-a859-1fdd9ea90a90	TCODE	CAPP	2
a432917c-fd59-4719-a9f4-7ab2bd640e3c	ee3cd4f5-615f-41b0-8d6a-4459f2be093c	TCODE	PA62	1
f8ee962c-a84c-417b-b76e-f2a43ff2cf7d	ee3cd4f5-615f-41b0-8d6a-4459f2be093c	TCODE	CAPS	2
fa5e10b5-7367-478a-9627-42f0439175e1	38a93ed3-6292-4b1a-a9d7-629fa6350d4f	TCODE	PA62	1
4cc2c169-0f5b-4c44-bcb0-f5fef093de68	38a93ed3-6292-4b1a-a9d7-629fa6350d4f	TCODE	CAT4	2
d3a9646f-cc2e-4ead-902c-092965b4ec46	b89e1f1c-8eff-46d1-af40-0ccdf9724bf8	TCODE	PA63	1
799b0abf-8a30-4d6f-899e-a49c0556b2cf	b89e1f1c-8eff-46d1-af40-0ccdf9724bf8	TCODE	CAPP	2
65b05bfc-45e5-487d-89c6-ab30ec4a71fb	25435677-995e-4559-91ea-5f43d0221e45	TCODE	PA63	1
065e3fd0-c5bb-48c5-926d-a081610738ed	25435677-995e-4559-91ea-5f43d0221e45	TCODE	CAPS	2
fd297c49-9149-4fd4-873e-e138587fdfd8	eed23a54-2b28-4162-a0e9-d9f6270181c1	TCODE	PA63	1
01609970-50c0-46c4-9816-d80db3fb4426	eed23a54-2b28-4162-a0e9-d9f6270181c1	TCODE	CAT4	2
7215746c-7bb3-4c90-9adf-a3d4ea2ba3c8	da8d78ce-56fe-4925-ab27-4ded6afc029e	TCODE	PA71	1
873da15f-94d3-4939-a3b7-513147744291	da8d78ce-56fe-4925-ab27-4ded6afc029e	TCODE	CAPP	2
854d080d-5d1d-44d2-8a01-5970741ce905	6d6edbb7-a8fe-4531-9049-d36d7e9d46d8	TCODE	PA71	1
4443dd2c-6a47-4635-b900-1fb18b877292	6d6edbb7-a8fe-4531-9049-d36d7e9d46d8	TCODE	CAPS	2
fde4e474-d944-4326-80a5-5a2608f5fbf1	c1a22f6b-df5b-4a32-88ad-74d302e44b03	TCODE	PA71	1
c3e54ee9-bd1a-4b1a-a877-efc057c55331	c1a22f6b-df5b-4a32-88ad-74d302e44b03	TCODE	CAT4	2
69d5727d-f623-4dba-b984-893a65899d68	cb8541a2-b5af-4219-92ed-d7ce1696467d	TCODE	PT50	1
73ce900e-f1dc-4997-89f0-c5d3319d6eda	cb8541a2-b5af-4219-92ed-d7ce1696467d	TCODE	CAPP	2
209e1575-8a4b-4caf-b5a8-aeecd678889b	95be27d3-9d23-4a7e-8a4b-dd236920c85f	TCODE	PT50	1
113469dc-e078-4beb-af57-88e3d1e6cc08	95be27d3-9d23-4a7e-8a4b-dd236920c85f	TCODE	CAPS	2
c4659df0-6388-4991-89df-6c9dcd3e9677	11fb2cd6-6106-4fb1-9968-1fcfcfdb0a96	TCODE	PT50	1
f9adc49e-b2c8-418d-94be-581becdbc0ba	11fb2cd6-6106-4fb1-9968-1fcfcfdb0a96	TCODE	CAT4	2
a7e26ecc-a6d6-44fe-b63d-27ec72218bd9	ad46e086-dde8-4b9c-ae8d-0461f61e9058	TCODE	PW61	1
bd936ab5-acdb-4d4e-be1f-9d895d0762b0	ad46e086-dde8-4b9c-ae8d-0461f61e9058	TCODE	CAPP	2
cbbcd37a-6118-4573-bc8e-0327b60536e8	a7393127-75b2-42f5-88b8-05178bf85b49	TCODE	PW61	1
8fed0ef2-4150-4664-8677-27a773626093	a7393127-75b2-42f5-88b8-05178bf85b49	TCODE	CAPS	2
a45d598e-22d7-414e-8c84-5a549d3075e9	e8658153-a0b5-4fd2-a1df-e02c7b17f6ea	TCODE	PW61	1
bfc17cda-a34c-4f83-bbbc-4cf2fac70c84	e8658153-a0b5-4fd2-a1df-e02c7b17f6ea	TCODE	CAT4	2
454105a0-d6a3-448c-a9f5-9dc1d850a0af	170fd75b-c68c-4491-883f-baad4ba71651	TCODE	OH11	1
806037fb-19c0-40ee-b252-b8efde56ab1b	170fd75b-c68c-4491-883f-baad4ba71651	TCODE	PA03	2
03792354-a370-4ab0-bc80-23a01d1a5164	af6baa02-e8ae-4a89-a568-8bba0eac79d2	TCODE	OH11	1
de94e8c3-61e5-4f9c-a009-7c3803ec5983	af6baa02-e8ae-4a89-a568-8bba0eac79d2	TCODE	PC00_M99_CALC	2
321deecc-b496-45e3-9216-923954600de1	d2e06c2d-9c81-477d-ad70-d7df15492367	TCODE	OH11	1
f002a179-edee-4c3d-9f21-d322839c3261	d2e06c2d-9c81-477d-ad70-d7df15492367	TCODE	PC00_M99_PA03_CORR	2
1a53dab7-5d05-4389-a34c-4c4ec34dc9af	84a8db24-5331-4481-be6f-9d075e710360	TCODE	OH11	1
55aca4d2-b3f8-4497-926b-0fed6923a769	84a8db24-5331-4481-be6f-9d075e710360	TCODE	PC00_M99_PA03_END	2
3a87fa2c-0cec-4f4d-98f2-25e928743948	5033e2c2-01c9-4aaa-a52b-7a48600a8ef3	TCODE	PA70	1
4ac2fd05-f0f1-40b6-9924-ab69fc2bfa31	5033e2c2-01c9-4aaa-a52b-7a48600a8ef3	TCODE	OH11	2
876b733d-6bb6-4bff-b33a-79bef4b4095a	99dc760b-b79f-4896-a96d-74664ce7db08	TCODE	PU03	1
78b91fd9-e7dd-4c30-9d00-b5e350ff987c	99dc760b-b79f-4896-a96d-74664ce7db08	TCODE	OH11	2
cae41795-d8b3-4629-b555-82264eb524c2	69737c57-c45d-4fcc-9133-3a83e96fa0e4	TCODE	PU01	1
6e128724-20a9-4aad-8080-715f9e102b03	69737c57-c45d-4fcc-9133-3a83e96fa0e4	TCODE	PA03	2
2cd1572f-77a5-499a-8fc4-15ea8d99ec51	dcad4a0c-10ba-464c-ba2d-3617288ebb0b	TCODE	PU01	1
4f27ad1c-67ae-45f5-9d4c-c0e8d06b7334	dcad4a0c-10ba-464c-ba2d-3617288ebb0b	TCODE	PC00_M99_CALC	2
c3b91cb4-7476-46cb-a607-d82a06f36adc	148cadf6-f828-4cda-8a6e-10dda076d07e	TCODE	PU01	1
3b5800a5-48b4-494d-974a-1a78e6d90f96	148cadf6-f828-4cda-8a6e-10dda076d07e	TCODE	PC00_M99_PA03_CORR	2
5b813690-1547-4edc-ba76-fe3a40d66df7	b466cef9-65b6-437c-85ad-1bc32d18d9fc	TCODE	PU01	1
b4045479-4d4f-4342-81df-c29f09df4b31	b466cef9-65b6-437c-85ad-1bc32d18d9fc	TCODE	PC00_M99_PA03_END	2
8fd4eca5-63be-46d0-ba34-d0f3d2cfc245	023fa54a-6a3d-4a79-8899-9346e07de620	TCODE	PCP0	1
c0a94fe1-40c0-4f6c-8cee-1a56d580699a	023fa54a-6a3d-4a79-8899-9346e07de620	TCODE	PC00_M99_CIPC	2
bba6d96f-2846-4492-a24d-61eeac46004a	477110cd-bdd1-42a4-ace9-1455a31a54d6	TCODE	PCP0	1
47a51b83-bae9-4202-9c32-3d72a1590ff1	477110cd-bdd1-42a4-ace9-1455a31a54d6	TCODE	PC00_M99_CIPE	2
2b635e47-d025-4795-9416-4d2de73641a9	d0f9d198-7a30-4993-ba21-806bdb411fd5	TCODE	PCP0	1
d11d9509-938b-4d03-b334-04c820b2599c	bdae59df-3bd7-4f2f-9b62-542ad022272b	TCODE	PA30	1
6b0a074a-9684-4ac9-8b13-da02a50ea4e3	bdae59df-3bd7-4f2f-9b62-542ad022272b	TCODE	PC00_M99_PA03_CORR	2
\.


--
-- Data for Name: GrcUser; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."GrcUser" (id_user, user_code, full_name, email, status, source_system, "institutionId", created_at, updated_at) FROM stdin;
c6434934-6201-4ba0-80a8-69b854948f16	MMORALES	Marco Morales	marco.morales@empresa.cl	t	SAP	inst1	2026-05-08 19:59:43.786	2026-05-08 19:59:43.786
86c0f40e-544e-4611-a90b-4576e7398e6e	ARIVERA	Ana Rivera	ana.rivera@empresa.cl	t	SAP	inst1	2026-05-08 19:59:43.795	2026-05-08 19:59:43.795
bd583fcd-764b-490a-b7df-bbe4a38d017e	JPEREZ	Juan Pérez	juan.perez@empresa.cl	t	SAP	inst1	2026-05-08 19:59:43.799	2026-05-08 19:59:43.799
10e6ab0d-0773-4cc9-97c6-604c0f31c891	MRIELOFF	Maxim Vladimir Rieloff Nuñez	mrieloff@socovesa.cl	t	SAP ECC 	inst1	2026-06-11 20:13:56.67	2026-06-11 20:13:56.67
\.


--
-- Data for Name: GrcUserRole; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."GrcUserRole" (id_user_role, id_user, id_role, assigned_at, valid_from, valid_to, status, "institutionId") FROM stdin;
2dc6acc3-75d2-4c3e-a98c-c362dd309ea1	bd583fcd-764b-490a-b7df-bbe4a38d017e	1e3576f2-d340-4cad-b427-55b54dc0b4f6	2026-04-02 14:15:00	2026-04-02 00:00:00	2026-12-31 00:00:00	t	inst1
886ee4df-f7ca-443e-ab19-21a1ecc27fc9	c6434934-6201-4ba0-80a8-69b854948f16	07e45bc3-972a-4fad-94f7-87c48f40ae14	2026-04-01 12:00:00	2026-04-01 00:00:00	\N	t	inst1
b89f4c1b-390c-49ee-9a6c-0ea929da8c47	86c0f40e-544e-4611-a90b-4576e7398e6e	004380b8-4e60-4742-9c2b-631c8db7f562	2026-04-02 13:00:00	2026-04-02 00:00:00	\N	t	inst1
efff8dc8-33bd-41fa-818b-1b1501278227	c6434934-6201-4ba0-80a8-69b854948f16	8a25c070-0740-467d-8587-c3d3887176c1	2026-04-01 12:01:00	2026-04-01 00:00:00	\N	t	inst1
70824634-eeed-4ba9-848f-8df892c97667	10e6ab0d-0773-4cc9-97c6-604c0f31c891	1e3576f2-d340-4cad-b427-55b54dc0b4f6	2026-06-11 00:00:00	2026-06-11 00:00:00	2026-06-25 00:00:00	t	inst1
df159a48-dcc2-4ab4-84d9-1f5a585e2f82	10e6ab0d-0773-4cc9-97c6-604c0f31c891	004380b8-4e60-4742-9c2b-631c8db7f562	2026-06-19 00:00:00	2026-06-19 00:00:00	2026-08-19 00:00:00	t	inst1
48c1b71c-843e-4af5-b3d1-c9e659d95f1d	10e6ab0d-0773-4cc9-97c6-604c0f31c891	8a25c070-0740-467d-8587-c3d3887176c1	2026-06-19 00:00:00	2026-06-19 00:00:00	2026-07-31 00:00:00	t	inst1
\.


--
-- Data for Name: Institution; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Institution" (id, name, "createdAt", "updatedAt") FROM stdin;
inst1	inst de prueba	2026-05-04 22:50:08.819	2026-05-04 22:50:08.819
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, email, name, password, "institutionId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: GrcAnalysisRun GrcAnalysisRun_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GrcAnalysisRun"
    ADD CONSTRAINT "GrcAnalysisRun_pkey" PRIMARY KEY (id_run);


--
-- Name: GrcFinding GrcFinding_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GrcFinding"
    ADD CONSTRAINT "GrcFinding_pkey" PRIMARY KEY (id_finding);


--
-- Name: GrcImportLog GrcImportLog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GrcImportLog"
    ADD CONSTRAINT "GrcImportLog_pkey" PRIMARY KEY (id_import);


--
-- Name: GrcMitigation GrcMitigation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GrcMitigation"
    ADD CONSTRAINT "GrcMitigation_pkey" PRIMARY KEY (id_mitigation);


--
-- Name: GrcRiskRule GrcRiskRule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GrcRiskRule"
    ADD CONSTRAINT "GrcRiskRule_pkey" PRIMARY KEY (id_rule);


--
-- Name: GrcRoleTrx GrcRoleTrx_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GrcRoleTrx"
    ADD CONSTRAINT "GrcRoleTrx_pkey" PRIMARY KEY (id_role_trx);


--
-- Name: GrcRole GrcRole_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GrcRole"
    ADD CONSTRAINT "GrcRole_pkey" PRIMARY KEY (id_role);


--
-- Name: GrcRuleItem GrcRuleItem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GrcRuleItem"
    ADD CONSTRAINT "GrcRuleItem_pkey" PRIMARY KEY (id_rule_item);


--
-- Name: GrcUserRole GrcUserRole_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GrcUserRole"
    ADD CONSTRAINT "GrcUserRole_pkey" PRIMARY KEY (id_user_role);


--
-- Name: GrcUser GrcUser_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GrcUser"
    ADD CONSTRAINT "GrcUser_pkey" PRIMARY KEY (id_user);


--
-- Name: Institution Institution_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Institution"
    ADD CONSTRAINT "Institution_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: GrcMitigation_id_finding_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "GrcMitigation_id_finding_key" ON public."GrcMitigation" USING btree (id_finding);


--
-- Name: GrcRiskRule_rule_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "GrcRiskRule_rule_code_key" ON public."GrcRiskRule" USING btree (rule_code);


--
-- Name: GrcRole_role_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "GrcRole_role_name_key" ON public."GrcRole" USING btree (role_name);


--
-- Name: GrcUser_user_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "GrcUser_user_code_key" ON public."GrcUser" USING btree (user_code);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: GrcAnalysisRun GrcAnalysisRun_institutionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GrcAnalysisRun"
    ADD CONSTRAINT "GrcAnalysisRun_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES public."Institution"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GrcFinding GrcFinding_id_role_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GrcFinding"
    ADD CONSTRAINT "GrcFinding_id_role_fkey" FOREIGN KEY (id_role) REFERENCES public."GrcRole"(id_role) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: GrcFinding GrcFinding_id_rule_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GrcFinding"
    ADD CONSTRAINT "GrcFinding_id_rule_fkey" FOREIGN KEY (id_rule) REFERENCES public."GrcRiskRule"(id_rule) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GrcFinding GrcFinding_id_run_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GrcFinding"
    ADD CONSTRAINT "GrcFinding_id_run_fkey" FOREIGN KEY (id_run) REFERENCES public."GrcAnalysisRun"(id_run) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GrcFinding GrcFinding_id_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GrcFinding"
    ADD CONSTRAINT "GrcFinding_id_user_fkey" FOREIGN KEY (id_user) REFERENCES public."GrcUser"(id_user) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: GrcFinding GrcFinding_institutionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GrcFinding"
    ADD CONSTRAINT "GrcFinding_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES public."Institution"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GrcImportLog GrcImportLog_institutionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GrcImportLog"
    ADD CONSTRAINT "GrcImportLog_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES public."Institution"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GrcMitigation GrcMitigation_id_finding_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GrcMitigation"
    ADD CONSTRAINT "GrcMitigation_id_finding_fkey" FOREIGN KEY (id_finding) REFERENCES public."GrcFinding"(id_finding) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GrcRiskRule GrcRiskRule_institutionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GrcRiskRule"
    ADD CONSTRAINT "GrcRiskRule_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES public."Institution"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GrcRoleTrx GrcRoleTrx_institutionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GrcRoleTrx"
    ADD CONSTRAINT "GrcRoleTrx_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES public."Institution"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GrcRoleTrx GrcRoleTrx_role_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GrcRoleTrx"
    ADD CONSTRAINT "GrcRoleTrx_role_name_fkey" FOREIGN KEY (role_name) REFERENCES public."GrcRole"(role_name) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GrcRole GrcRole_institutionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GrcRole"
    ADD CONSTRAINT "GrcRole_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES public."Institution"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GrcRuleItem GrcRuleItem_id_rule_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GrcRuleItem"
    ADD CONSTRAINT "GrcRuleItem_id_rule_fkey" FOREIGN KEY (id_rule) REFERENCES public."GrcRiskRule"(id_rule) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GrcUserRole GrcUserRole_id_role_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GrcUserRole"
    ADD CONSTRAINT "GrcUserRole_id_role_fkey" FOREIGN KEY (id_role) REFERENCES public."GrcRole"(id_role) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GrcUserRole GrcUserRole_id_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GrcUserRole"
    ADD CONSTRAINT "GrcUserRole_id_user_fkey" FOREIGN KEY (id_user) REFERENCES public."GrcUser"(id_user) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GrcUserRole GrcUserRole_institutionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GrcUserRole"
    ADD CONSTRAINT "GrcUserRole_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES public."Institution"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GrcUser GrcUser_institutionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GrcUser"
    ADD CONSTRAINT "GrcUser_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES public."Institution"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_institutionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES public."Institution"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

