
# Install dependencies only when needed
FROM registry-gitlab.zalopay.vn/docker/images/node:20.19.0-alpine AS deps

# Arguments passed from docker build command
ARG VERDACCIO_ZTOOL_TOKEN

# Set working directory
WORKDIR /app

# Copy files that are needed for installing dependencies
COPY .gitignore .gitignore
COPY .npmrc .npmrc
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

# RUN npm config set registry http://10.40.27.12:31291/repository/npm-registry/

# Security read more https://www.alexandraulsh.com/2018/06/25/docker-npmrc-security/
ENV NPM_TOKEN=$VERDACCIO_ZTOOL_TOKEN

# Clone the code from .gitlab-ci.yml
RUN echo "//repo.zalopay.vn/verdaccio/:_authToken=${NPM_TOKEN}" >> .npmrc && \
    echo "//repo.zalopay.vn:443/verdaccio/:_authToken=${NPM_TOKEN}" >> .npmrc
# RUN cat .npmrc
RUN npm install --frozen-lockfile

# Rebuild the source code only when needed
FROM registry-gitlab.zalopay.vn/docker/images/node:20.19.0-alpine AS builder
ARG VAR_ENV
RUN echo "env1 = "
RUN echo $VAR_ENV
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN if [ "x$VAR_ENV" = "xdev" ] ; then npm run build-dev ; fi

# Build stg
# RUN if [ "x$VAR_ENV" = "x" ] ; then npm run build-stg; fi

# Build prod
RUN if [ "x$VAR_ENV" = "xqc" ] ; then npm run build; fi


# Production image, copy all the files and run next
FROM registry-gitlab.zalopay.vn/docker/images/node:20.19.0-alpine AS runner
ARG VAR_ENV
RUN echo "env2 = "
RUN echo $VAR_ENV
WORKDIR /app

ENV ENV production

# Create nodejs group and nextjs user (Alpine syntax)
RUN addgroup -g 1001 -S nodejs || true
RUN adduser -S nextjs -u 1001 || true

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/start.sh .

# Build dev
RUN if [ "x$VAR_ENV" = "xdev" ] ; then rsync -av /app/.next/ mct_telco@10.50.1.200::data/static/telco/webpayment/_next ; fi

# Build stg
# RUN if [ "x$VAR_ENV" = "x" ] ; then rsync -av /app/.next/ 10.30.83.13::data/cdn/zpw/telco/webpayment/_next ; fi

# Build prod
RUN if [ "x$VAR_ENV" = "xqc" ] ; then rsync -av /app/.next/ mct_telco@10.30.83.13::zpw-static/telco/webpayment/_next; fi

USER nextjs

EXPOSE 8080

ENV PORT 8080

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1
ENTRYPOINT ["node_modules/.bin/next", "start", "-p", "8080"]
