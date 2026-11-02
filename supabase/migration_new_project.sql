-- ============================================================
-- RESIKU - Clean Migration SQL untuk Supabase Project Baru
-- Generated dari backup: db_cluster-02-09-2026@00-35-06.backup.gz
-- Jalankan di: Supabase Dashboard > SQL Editor
-- ============================================================

-- ============================================================
-- 1. EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


-- ============================================================
-- 2. ENUM TYPES
-- ============================================================
CREATE TYPE public.user_role AS ENUM (
    'admin',
    'customer'
);

CREATE TYPE public.warranty_status AS ENUM (
    'active',
    'expiring',
    'expired'
);


-- ============================================================
-- 3. TABLES
-- ============================================================

-- profiles (harus dibuat duluan karena tabel lain FK ke sini)
CREATE TABLE public.profiles (
    id uuid NOT NULL,
    role public.user_role DEFAULT 'customer'::public.user_role NOT NULL,
    name text,
    email text NOT NULL,
    subscription_tier text DEFAULT 'free'::text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    whatsapp text,
    avatar_url text
);

-- assets
CREATE TABLE public.assets (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    brand text,
    category text,
    purchase_date date,
    price numeric(10,2),
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- bills
CREATE TABLE public.bills (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    amount numeric(10,2),
    due_day integer NOT NULL,
    due_date date NOT NULL,
    status text DEFAULT 'unpaid'::text,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- legal_docs
CREATE TABLE public.legal_docs (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    doc_number text,
    category text NOT NULL,
    expiry_date date NOT NULL,
    amount numeric(10,2),
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- notifications
CREATE TABLE public.notifications (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    asset_id uuid,
    type text NOT NULL,
    sent_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_read boolean DEFAULT false NOT NULL
);

-- receipts
CREATE TABLE public.receipts (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    asset_id uuid NOT NULL,
    file_url text NOT NULL,
    file_type text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- services
CREATE TABLE public.services (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    provider text,
    interval_months integer NOT NULL,
    last_service_date date,
    next_service_date date NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- warranties
CREATE TABLE public.warranties (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    asset_id uuid NOT NULL,
    expiry_date date NOT NULL,
    duration_months integer,
    status public.warranty_status DEFAULT 'active'::public.warranty_status NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ============================================================
-- 4. PRIMARY KEYS
-- ============================================================
ALTER TABLE ONLY public.profiles    ADD CONSTRAINT profiles_pkey    PRIMARY KEY (id);
ALTER TABLE ONLY public.assets      ADD CONSTRAINT assets_pkey      PRIMARY KEY (id);
ALTER TABLE ONLY public.bills       ADD CONSTRAINT bills_pkey       PRIMARY KEY (id);
ALTER TABLE ONLY public.legal_docs  ADD CONSTRAINT legal_docs_pkey  PRIMARY KEY (id);
ALTER TABLE ONLY public.notifications ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.receipts    ADD CONSTRAINT receipts_pkey    PRIMARY KEY (id);
ALTER TABLE ONLY public.services    ADD CONSTRAINT services_pkey    PRIMARY KEY (id);
ALTER TABLE ONLY public.warranties  ADD CONSTRAINT warranties_pkey  PRIMARY KEY (id);


-- ============================================================
-- 5. FOREIGN KEYS
-- ============================================================
ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT bills_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.legal_docs
    ADD CONSTRAINT legal_docs_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_asset_id_fkey
    FOREIGN KEY (asset_id) REFERENCES public.assets(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.receipts
    ADD CONSTRAINT receipts_asset_id_fkey
    FOREIGN KEY (asset_id) REFERENCES public.assets(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.warranties
    ADD CONSTRAINT warranties_asset_id_fkey
    FOREIGN KEY (asset_id) REFERENCES public.assets(id) ON DELETE CASCADE;


-- ============================================================
-- 6. INDEXES
-- ============================================================
CREATE INDEX idx_assets_user_id         ON public.assets        USING btree (user_id);
CREATE INDEX idx_notifications_is_read  ON public.notifications  USING btree (is_read);
CREATE INDEX idx_notifications_user_id  ON public.notifications  USING btree (user_id);
CREATE INDEX idx_profiles_email         ON public.profiles       USING btree (email);
CREATE INDEX idx_receipts_asset_id      ON public.receipts       USING btree (asset_id);
CREATE INDEX idx_warranties_asset_id    ON public.warranties     USING btree (asset_id);
CREATE INDEX idx_warranties_status      ON public.warranties     USING btree (status);


-- ============================================================
-- 7. FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT role::text FROM public.profiles WHERE id = user_id;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
AS $$
begin
  insert into public.profiles (id, email, name, role, subscription_tier)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'customer', 'free');
  return new;
end;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;


-- ============================================================
-- 8. TRIGGERS
-- ============================================================

-- Auto-create profile saat user baru register
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE TRIGGER set_assets_updated_at
    BEFORE UPDATE ON public.assets
    FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

CREATE TRIGGER set_warranties_updated_at
    BEFORE UPDATE ON public.warranties
    FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


-- ============================================================
-- 9. ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.assets        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_docs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warranties    ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 10. RLS POLICIES
-- ============================================================

-- === profiles ===
CREATE POLICY "Users can view their own profile."
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Admins can view all profiles."
    ON public.profiles FOR SELECT
    USING ((auth.uid() = id) OR (public.get_user_role(auth.uid()) = 'admin'::text));

-- === assets ===
CREATE POLICY "Users can view their own assets."
    ON public.assets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assets."
    ON public.assets FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assets."
    ON public.assets FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assets."
    ON public.assets FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all assets"
    ON public.assets FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Public can verify assets"
    ON public.assets FOR SELECT
    USING (true);

-- === bills ===
CREATE POLICY "Users CRUD own bills"
    ON public.bills
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- === legal_docs ===
CREATE POLICY "Users CRUD own legal_docs"
    ON public.legal_docs
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- === services ===
CREATE POLICY "Users CRUD own services"
    ON public.services
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- === notifications ===
CREATE POLICY "Users can view their own notifications."
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications."
    ON public.notifications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications."
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications."
    ON public.notifications FOR DELETE
    USING (auth.uid() = user_id);

-- === receipts ===
CREATE POLICY "Users can view receipts for their assets."
    ON public.receipts FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.assets
        WHERE assets.id = receipts.asset_id AND assets.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert receipts for their assets."
    ON public.receipts FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.assets
        WHERE assets.id = receipts.asset_id AND assets.user_id = auth.uid()
    ));

CREATE POLICY "Users can update receipts for their assets."
    ON public.receipts FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.assets
        WHERE assets.id = receipts.asset_id AND assets.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete receipts for their assets."
    ON public.receipts FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.assets
        WHERE assets.id = receipts.asset_id AND assets.user_id = auth.uid()
    ));

-- === warranties ===
CREATE POLICY "Users can view warranties for their assets."
    ON public.warranties FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.assets
        WHERE assets.id = warranties.asset_id AND assets.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert warranties for their assets."
    ON public.warranties FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.assets
        WHERE assets.id = warranties.asset_id AND assets.user_id = auth.uid()
    ));

CREATE POLICY "Users can update warranties for their assets."
    ON public.warranties FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.assets
        WHERE assets.id = warranties.asset_id AND assets.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete warranties for their assets."
    ON public.warranties FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.assets
        WHERE assets.id = warranties.asset_id AND assets.user_id = auth.uid()
    ));

CREATE POLICY "Public can verify warranties"
    ON public.warranties FOR SELECT
    USING (true);


-- ============================================================
-- 11. STORAGE BUCKET - receipts
-- (Jalankan ini di SQL Editor setelah bucket dibuat manual
--  ATAU buat bucket via Dashboard > Storage > New Bucket: "receipts", Public)
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public bisa lihat struk"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'receipts'::text);

CREATE POLICY "User bisa upload struk miliknya"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'receipts'::text
        AND (auth.uid())::text = (storage.foldername(name))[1]
    );

CREATE POLICY "User bisa lihat struk miliknya"
    ON storage.objects FOR SELECT TO authenticated
    USING (
        bucket_id = 'receipts'::text
        AND (auth.uid())::text = (storage.foldername(name))[1]
    );

CREATE POLICY "User bisa hapus struk miliknya"
    ON storage.objects FOR DELETE TO authenticated
    USING (
        bucket_id = 'receipts'::text
        AND (auth.uid())::text = (storage.foldername(name))[1]
    );


-- ============================================================
-- SELESAI! Schema berhasil dimigrasikan.
-- ============================================================
