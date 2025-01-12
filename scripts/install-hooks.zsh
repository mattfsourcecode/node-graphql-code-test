#!/usr/bin/env zsh

# Colors for output
autoload -U colors && colors
RED="[0;31m"
GREEN="[0;32m"
YELLOW="[1;33m"
NC="[0m" # No Color

echo "${YELLOW}Installing git hooks...${NC}
"

# Ensure we are in the project root
SCRIPT_DIR=${0:a:h}
cd ${SCRIPT_DIR}/..

# Create hooks directory if it does not exist
if [ ! -d .git/hooks ]; then
    echo "${YELLOW}Creating .git/hooks directory...${NC}"
    mkdir -p .git/hooks
    if [ $? -ne 0 ]; then
        echo "${RED}Failed to create .git/hooks directory${NC}"
        exit 1
    fi
fi

# Create symlinks for each hook in .hooks directory
for hook in .hooks/*; do
    if [ -f "$hook" ]; then
        hook_name=$(basename $hook)
        target=".git/hooks/$hook_name"
        
        # Remove existing hook/symlink if it exists
        if [ -L "$target" ] || [ -f "$target" ]; then
            echo "${YELLOW}Removing existing $hook_name hook...${NC}"
            rm "$target"
            if [ $? -ne 0 ]; then
                echo "${RED}Failed to remove existing $hook_name hook${NC}"
                exit 1
            fi
        fi
        
        # Create the symlink
        echo "${YELLOW}Creating symlink for $hook_name...${NC}"
        ln -s "../../.hooks/$hook_name" "$target"
        if [ $? -ne 0 ]; then
            echo "${RED}Failed to create symlink for $hook_name${NC}"
            exit 1
        fi
        
        # Ensure hook is executable
        chmod +x "$hook"
        if [ $? -ne 0 ]; then
            echo "${RED}Failed to make $hook_name executable${NC}"
            exit 1
        fi
    fi
done

echo "
${GREEN}Git hooks installed successfully!${NC}"
