CREATE TABLE projects (
    id UUID PRIMARY KEY,
    title VARCHAR(55) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    price DECIMAL NOT NULL,
    allow_higher_price BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    user_id BIGINT NOT NULL
);
