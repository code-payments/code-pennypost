FROM oven/bun:latest as builder

# prisma generate requires node 
# https://github.com/oven-sh/bun/issues/5320#issuecomment-1730927088
COPY --from=node:18 /usr/local/bin/node /usr/local/bin/node

WORKDIR /app

# Copy the entire workspace from the project root
COPY package.json /app/
COPY packages /app/packages

# Install dependencies for the entire workspace
RUN cd /app/ && bun install --workspaces
RUN cd /app/packages/database && bun run db:init

# Final stage
FROM oven/bun:latest
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy necessary files from the builder stage
COPY --from=builder /app /app

WORKDIR /app/packages/backend

# Expose the port the app runs on
EXPOSE 3000

# Add curl for health check
HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 CMD curl http://localhost:3000 || exit 1

# Start the application using bun
ENV NODE_ENV=production
CMD ["bun", "src/server.ts"]