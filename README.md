# Secure Key Distribution & Encrypted Communication System

## Overview
This project demonstrates a secure, session-based communication system where registered nodes exchange encrypted messages using dynamically generated session keys.

The system simulates concepts inspired by Quantum Key Distribution (QKD) at an application level.

## Key Features
- Node registration and discovery
- Session-based key generation
- Encrypted message exchange (AES)
- Receiver-side acceptance before decryption
- Temporary secure sessions
- MongoDB-backed persistence

## System Flow
1. Nodes register with the server
2. Sender selects receiver and initiates communication
3. A temporary session key is generated for the node pair
4. Message is encrypted using the session key
5. Receiver must accept the request
6. Message is decrypted only after acceptance

## Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose
- JavaScript (Crypto module)
- HTML, CSS, Vanilla JS

## Why This Project?
This project was built to demonstrate:
- Secure key exchange concepts
- Session management
- Encrypted communication pipelines
- Backend-driven security logic

## Interview Highlight (1 line)
> Implemented a temporary secure session handshake where the receiver must explicitly accept a communication request before decrypting the encrypted message.

## How to Run
```bash
# Backend
cd backend
npm install
npm start
