# Changelog

All the changes can be found below. Order used:

- Added
- Changed
- Deprecated
- Removed
- Fixed
- Security

## v2.1.1

### Fixed
- Fixed error when using nested `For` loops.

## v2.1.0

### Added
- Added `jsx-jcs-no-undef` rule that replaces the built-in `no-undef` rule with one that is tolerant of variables expressed in `<For>`.

## v2.0.1

## Fixed
- Fixed working on node `v0.10` and `v0.12`.

## v2.0.0

### Removed
 - removed `jsx-for-single-child` (Multiple children are now supported).
 - removed `jsx-if-single-child` (Multiple children are now supported).
 - removed `jsx-for-require-index`.
 - removed `lodash` dependency.

## v1.0.2

### Fixed
- Fixed: Allow JSX Expression to be used as child inside `If` and `For` tags.

## v1.0.1

### Changed
- Internal: Refactor code.

### Fixed
- Fix build on node v0.x and iojs.

## v1.0.0

### Added
- Rule `jsx-for-require-each`.
- Rule `jsx-for-require-index`.
- Rule `jsx-for-require-of`.

### Changed
- Renamed `jsx-if-condition` to `jsx-if-require-condition`.

## 0.2.0

### Added
- Rule: `jsx-for-single-child`.
- Rule: `jsx-use-if-tag`.

## 0.1.1

### Fixed
- Fix false negatives in `jsx-if-single-child`.

## 0.1.0

Initial release

## Added
- Rule: `jsx-if-condition`.
- Rule: `jsx-if-single-child`.
