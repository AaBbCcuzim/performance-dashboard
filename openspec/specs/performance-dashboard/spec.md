# performance-dashboard Specification

## Purpose
TBD - created by archiving change performance-dashboard-mvp. Update Purpose after archive.
## Requirements
### Requirement: Dashboard renders metric cards with latest values
The system SHALL display metric cards on the main dashboard showing the latest value for each tracked metric (CPU, Memory, Network, Disk) per host. Each card MUST display the metric name, current value with unit, and a mini sparkline of recent trend.

#### Scenario: Dashboard loads with default metrics
- **WHEN** user navigates to the dashboard homepage
- **THEN** metric cards render for all default metric categories showing their latest values

#### Scenario: New data arrives via polling
- **WHEN** the polling scheduler fetches a new batch of metric data
- **THEN** metric cards update their displayed values within 200ms without full page reload

### Requirement: Time-series chart renders large datasets
The system SHALL render time-series line charts using Canvas-based rendering that supports up to 1,000,000 data points per chart. The system MUST apply LTTB downsampling to reduce rendered points to the viewport resolution while preserving visual characteristics.

#### Scenario: Chart loads 1 million data points
- **WHEN** a chart receives a series with 1,000,000 data points
- **THEN** the chart renders at 30fps or higher and first paint completes within 2 seconds

#### Scenario: Downsampling activates on data threshold
- **WHEN** the raw data points exceed 2x the viewport pixel width
- **THEN** the system automatically applies LTTB downsampling before passing data to the chart renderer

### Requirement: Multi-dimensional comparison view
The system SHALL provide a comparison view where users can display up to 4 time-series charts simultaneously, each configurable to show different metric/host combinations. Each chart MUST support independent pan, zoom, and time range selection.

#### Scenario: Side-by-side metric comparison
- **WHEN** user configures 4 chart panels with different metric types
- **THEN** all 4 charts render independently and respond to user interaction without blocking each other

#### Scenario: Chart interaction does not block UI
- **WHEN** user zooms into one chart while other charts are visible
- **THEN** the zoom interaction completes within 100ms and the main thread remains responsive

### Requirement: Configurable polling interval
The system SHALL poll for new metric data at a configurable interval (1s, 5s, 10s, 30s). TanStack Query MUST manage cache invalidation and deduplication of concurrent requests.

#### Scenario: Polling interval change takes effect
- **WHEN** user changes polling interval from 5s to 10s
- **THEN** subsequent polls occur at the new 10s interval without requiring page refresh

#### Scenario: Query deduplication
- **WHEN** multiple components request the same metric data within the same polling window
- **THEN** only one network request is made and results are shared across components

### Requirement: Time range selection
The system SHALL provide a time range selector with presets (Last 1 hour, Last 6 hours, Last 24 hours) and a custom range option. Changing the time range MUST trigger automatic downsampling resolution adjustment.

#### Scenario: Switching from 1h to 24h range
- **WHEN** user selects "Last 24 hours" from the time range selector
- **THEN** charts reload with appropriate downsampling for the wider time window

### Requirement: Mock data generation with schema validation
The system SHALL include a mock data generator that produces realistic multi-host, multi-metric time-series data. All generated data MUST pass Zod schema validation before being consumed by the application.

#### Scenario: Generated data passes validation
- **WHEN** the mock generator produces a batch of metric data points
- **THEN** Zod schema validation succeeds and data enters the TanStack Query cache

#### Scenario: Invalid data is rejected
- **WHEN** corrupted or schema-mismatched data enters the system
- **THEN** Zod validation fails and the data is discarded with a console warning

### Requirement: Routing with code-generated file routes
The system SHALL use TanStack Router with file-based routing and auto-generated route tree. Routes MUST include: root layout (`/`), dashboard index (`/`), comparison view (`/compare`), and metric detail (`/metric/$id`).

#### Scenario: Navigation between views
- **WHEN** user clicks a navigation link to the comparison view
- **THEN** TanStack Router navigates to `/compare` and renders the comparison component without full page reload

### Requirement: Memory stability under continuous operation
The system SHALL maintain stable memory usage during continuous operation. After 10 minutes of polling with 5-second intervals while displaying 4 charts with 1M data points each, total JavaScript heap growth MUST not exceed 50MB.

#### Scenario: Extended run without memory leak
- **WHEN** the dashboard runs for 10 minutes with 5s polling and 1M-point charts
- **THEN** memory profiler shows heap growth under 50MB and no detached DOM nodes accumulate

