# Code Standards

## Overview
This document outlines the code standards for the Marriott Hotels platform, including language conventions, formatting, and best practices.

## Table of Contents
- [General Principles](#general-principles)
- [Language Guidelines](#language-guidelines)
- [Formatting](#formatting)
- [Naming Conventions](#naming-conventions)
- [Testing](#testing)
- [Documentation](#documentation)

## General Principles
- Write clean, readable, and maintainable code.
- Prefer clarity over cleverness.
- Keep functions and files small and focused.
- Avoid code duplication.

## Language Guidelines
- Use TypeScript for all application code.
- Use ES2020+ features where supported.
- Prefer async/await over callbacks and promises.
- Use strict typing and avoid `any` where possible.

## Formatting
- Use 2 spaces for indentation.
- Use Prettier for code formatting.
- Use single quotes for strings.
- Limit lines to 100 characters.
- End files with a newline.

## Naming Conventions
- Use camelCase for variables and functions.
- Use PascalCase for classes and React components.
- Use UPPER_CASE for constants.
- Prefix interfaces with `I` (e.g., `IUser`).
- Suffix types with `Type` (e.g., `UserType`).

## Testing
- Write unit and integration tests for all features.
- Use Jest and React Testing Library for tests.
- Place tests in `__tests__` directories.
- Use descriptive test names and assertions.

## Documentation
- Document all public functions and components.
- Use JSDoc or TSDoc for inline documentation.
- Update documentation with code changes.
- Follow the [Documentation Standards](documentation-standards.md). 