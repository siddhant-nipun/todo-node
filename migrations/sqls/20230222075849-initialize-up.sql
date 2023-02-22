CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table if not exists users (
    id uuid default uuid_generate_v4() not null primary key,
    name text not null,
    email text not null unique,
    password text not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone,
    archived_at timestamp with time zone
);

create table if not exists todos (
    id serial primary key,
    description text,
    user_id uuid references users,
    is_completed boolean default false,
    archived_at timestamp with time zone,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

create table if not exists user_session (
    id uuid default uuid_generate_v4() not null primary key,
    user_id uuid not null references users,
    session_token text not null,
    created_at timestamp with time zone default now(),
    archived_at timestamp with time zone
);