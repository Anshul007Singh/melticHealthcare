#!/bin/bash

#################################################
# Meltic Healthcare Deployment Script
#################################################
#
# This script automates the deployment process for
# the Meltic Healthcare mobile application.
#
# Usage:
#   ./scripts/deploy.sh [environment] [platform]
#
# Environments: development, staging, preview, production
# Platforms: android, ios, all
#
# Examples:
#   ./scripts/deploy.sh preview android
#   ./scripts/deploy.sh production all
#
#################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

print_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

# Parse arguments
ENVIRONMENT=${1:-preview}
PLATFORM=${2:-android}

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(development|staging|preview|production)$ ]]; then
    print_error "Invalid environment: $ENVIRONMENT"
    echo "Valid environments: development, staging, preview, production"
    exit 1
fi

# Validate platform
if [[ ! "$PLATFORM" =~ ^(android|ios|all)$ ]]; then
    print_error "Invalid platform: $PLATFORM"
    echo "Valid platforms: android, ios, all"
    exit 1
fi

print_info "========================================="
print_info "Meltic Healthcare Deployment Script"
print_info "========================================="
print_info "Environment: $ENVIRONMENT"
print_info "Platform: $PLATFORM"
print_info "========================================="
echo ""

#################################################
# 1. Pre-deployment Checks
#################################################

print_info "Step 1: Running pre-deployment checks..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi
print_success "Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi
print_success "npm version: $(npm --version)"

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    print_warning "EAS CLI is not installed. Installing now..."
    npm install -g eas-cli
    print_success "EAS CLI installed successfully"
else
    print_success "EAS CLI version: $(eas --version)"
fi

# Check if user is logged in to EAS
if ! eas whoami &> /dev/null; then
    print_error "Not logged in to EAS. Please run 'eas login' first."
    exit 1
fi
print_success "Logged in to EAS as: $(eas whoami)"

# Check git status
if [[ -n $(git status -s) ]]; then
    print_warning "You have uncommitted changes. It's recommended to commit before deploying."
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Deployment cancelled."
        exit 0
    fi
fi

print_success "Pre-deployment checks passed"
echo ""

#################################################
# 2. Install Dependencies
#################################################

print_info "Step 2: Installing dependencies..."

if [ ! -d "node_modules" ]; then
    print_info "Installing npm packages..."
    npm install
    print_success "Dependencies installed"
else
    print_info "Dependencies already installed, skipping..."
fi
echo ""

#################################################
# 3. Run Tests (if available)
#################################################

print_info "Step 3: Running tests..."

if grep -q "\"test\"" package.json; then
    print_info "Running test suite..."
    npm test || {
        print_error "Tests failed. Deployment aborted."
        exit 1
    }
    print_success "All tests passed"
else
    print_warning "No test script found in package.json, skipping tests..."
fi
echo ""

#################################################
# 4. TypeScript Type Checking
#################################################

print_info "Step 4: Running TypeScript type checking..."

if [ -f "tsconfig.json" ]; then
    npx tsc --noEmit || {
        print_error "TypeScript type checking failed. Deployment aborted."
        exit 1
    }
    print_success "TypeScript type checking passed"
else
    print_warning "tsconfig.json not found, skipping type checking..."
fi
echo ""

#################################################
# 5. Security Checks
#################################################

print_info "Step 5: Running security checks..."

# Check for exposed secrets
print_info "Checking for exposed secrets..."

EXPOSED_SECRETS=0

# Check for hardcoded credentials
if grep -rn "ck_[a-zA-Z0-9]" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules .; then
    print_error "Found exposed WooCommerce consumer key!"
    EXPOSED_SECRETS=1
fi

if grep -rn "cs_[a-zA-Z0-9]" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules .; then
    print_error "Found exposed WooCommerce consumer secret!"
    EXPOSED_SECRETS=1
fi

# Check for hardcoded API keys
if grep -rn "api[_-]key[\"']:\s*[\"'][^\"']*[\"']" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules .; then
    print_error "Found hardcoded API key!"
    EXPOSED_SECRETS=1
fi

if [ $EXPOSED_SECRETS -eq 1 ]; then
    print_error "Security check failed. Please remove exposed secrets before deploying."
    exit 1
fi

print_success "No exposed secrets found"
echo ""

#################################################
# 6. Build Configuration
#################################################

print_info "Step 6: Preparing build configuration..."

# Check if .env file exists for the environment
ENV_FILE=".env.$ENVIRONMENT"
if [ -f "$ENV_FILE" ]; then
    print_success "Environment file found: $ENV_FILE"
else
    print_warning "Environment file not found: $ENV_FILE"
    print_warning "Using default configuration from eas.json"
fi
echo ""

#################################################
# 7. Build Application
#################################################

print_info "Step 7: Building application..."

if [ "$ENVIRONMENT" == "production" ]; then
    print_warning "========================================="
    print_warning "PRODUCTION DEPLOYMENT WARNING"
    print_warning "========================================="
    print_warning "You are about to deploy to PRODUCTION!"
    print_warning "This will affect live users."
    echo ""
    read -p "Are you sure you want to continue? (yes/no) " -r
    if [[ ! $REPLY == "yes" ]]; then
        print_info "Deployment cancelled."
        exit 0
    fi
fi

print_info "Starting EAS Build for $ENVIRONMENT environment..."

# Build based on platform
if [ "$PLATFORM" == "android" ]; then
    print_info "Building for Android..."
    eas build --profile "$ENVIRONMENT" --platform android --non-interactive
    print_success "Android build completed"
elif [ "$PLATFORM" == "ios" ]; then
    print_info "Building for iOS..."
    eas build --profile "$ENVIRONMENT" --platform ios --non-interactive
    print_success "iOS build completed"
else
    print_info "Building for all platforms..."
    eas build --profile "$ENVIRONMENT" --platform all --non-interactive
    print_success "Builds completed for all platforms"
fi
echo ""

#################################################
# 8. Post-Build Actions
#################################################

print_info "Step 8: Post-build actions..."

# Get current git commit
GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
print_info "Git commit: $GIT_COMMIT"

# Get current timestamp
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
print_info "Build timestamp: $TIMESTAMP"

# Create deployment log
LOG_FILE="deployment_logs/deploy_${ENVIRONMENT}_$(date +%Y%m%d_%H%M%S).log"
mkdir -p deployment_logs

cat > "$LOG_FILE" <<EOF
Deployment Log
==============
Environment: $ENVIRONMENT
Platform: $PLATFORM
Timestamp: $TIMESTAMP
Git Commit: $GIT_COMMIT
Node Version: $(node --version)
npm Version: $(npm --version)
EAS CLI Version: $(eas --version)
Deployed by: $(eas whoami)

Status: SUCCESS
EOF

print_success "Deployment log created: $LOG_FILE"
echo ""

#################################################
# 9. Submission (Production Only)
#################################################

if [ "$ENVIRONMENT" == "production" ]; then
    print_info "Step 9: Preparing for store submission..."
    echo ""
    print_warning "To submit to app stores, run:"
    echo ""
    print_info "  Android (Google Play):"
    print_info "    eas submit --platform android --latest"
    echo ""
    print_info "  iOS (App Store):"
    print_info "    eas submit --platform ios --latest"
    echo ""
else
    print_info "Step 9: Skipping store submission (not production)"
fi

#################################################
# 10. Summary
#################################################

echo ""
print_success "========================================="
print_success "DEPLOYMENT COMPLETED SUCCESSFULLY!"
print_success "========================================="
echo ""
print_info "Build Summary:"
print_info "  Environment: $ENVIRONMENT"
print_info "  Platform: $PLATFORM"
print_info "  Git Commit: $GIT_COMMIT"
print_info "  Timestamp: $TIMESTAMP"
echo ""
print_info "Next Steps:"

if [ "$ENVIRONMENT" == "production" ]; then
    print_info "  1. Test the build on physical devices"
    print_info "  2. Submit to app stores using 'eas submit'"
    print_info "  3. Monitor crash reports and user feedback"
    print_info "  4. Update BACKEND_REQUIREMENTS.md status if needed"
else
    print_info "  1. Download the build from EAS dashboard"
    print_info "  2. Install on test devices"
    print_info "  3. Perform QA testing"
    print_info "  4. Report any issues to the development team"
fi

echo ""
print_info "EAS Dashboard: https://expo.dev/accounts/[your-account]/projects/meltic"
echo ""
print_success "Thank you for using Meltic Healthcare Deployment Script!"
echo ""
