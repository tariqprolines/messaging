# Frontend Screens Development Approach

## Current State Analysis

**Existing Screens:**
- ✅ Login Page - Functional
- ✅ Signup Page - Functional  
- ✅ Dashboard - Basic layout with stats (0 values, needs real data)
- ⚠️ Clients Page - Placeholder only
- ⚠️ Messages Page - Placeholder only
- ⚠️ Templates Page - Placeholder only

**Missing Components:**
- Navigation menu/sidebar
- Shared layout component
- API service functions for clients, messages, templates
- Data fetching hooks
- Form components

---

## Proposed Screen Structure

### 1. **Navigation & Layout**
**Shared Layout Component** with:
- **Sidebar Navigation** (persistent across all pages)
  - Dashboard icon/link
  - Clients icon/link
  - Messages icon/link
  - Templates icon/link
  - Logout button
- **Top Header** (optional)
  - User info (email/company name)
  - Notifications (if needed)
- **Main Content Area** (where page content renders)

---

### 2. **Clients Screen** (`/clients`)

#### Features:
- **Client List View**
  - Table/Grid showing all client contacts
  - Columns: Name, Phone, Email, Created Date, Actions
  - Search/Filter functionality
  - Pagination (if many clients)
  
- **Add Client Button**
  - Opens modal/form to add new client
  - Fields: Name (required), Phone (required), Email (optional), Extra Data (optional JSON)
  
- **Client Actions**
  - Edit client (inline or modal)
  - Delete client (with confirmation)
  - View client details
  - Quick actions (Send Message, View Messages)

#### UI Components Needed:
- `ClientList.jsx` - Main list component
- `ClientForm.jsx` - Add/Edit form (modal or inline)
- `ClientCard.jsx` - Individual client card/item
- `ClientSearch.jsx` - Search and filter component

#### API Endpoints Required:
- `GET /api/v1/clients` - List all clients
- `POST /api/v1/clients` - Create new client
- `GET /api/v1/clients/{id}` - Get client details
- `PUT /api/v1/clients/{id}` - Update client
- `DELETE /api/v1/clients/{id}` - Delete client

---

### 3. **Messages Screen** (`/messages`)

#### Features:
- **Send Message Section**
  - Form to compose and send message
  - Select client (dropdown/search)
  - Select template (optional, with preview)
  - Message content (text area)
  - Message type (SMS/Email - if supported)
  - Send button (single or bulk)
  
- **Message History View**
  - List of all sent messages
  - Columns: Client, Content (truncated), Status, Sent Date, Actions
  - Filter by status (Pending, Sent, Delivered, Failed)
  - Filter by date range
  - Search by client name or content
  
- **Message Status Indicators**
  - Color-coded status badges
  - Pending (yellow), Sent (blue), Delivered (green), Failed (red)
  
- **Message Details**
  - View full message content
  - View delivery status
  - View error message (if failed)
  - Retry failed messages

#### UI Components Needed:
- `MessageComposer.jsx` - Send message form
- `MessageList.jsx` - Message history list
- `MessageCard.jsx` - Individual message item
- `MessageStatusBadge.jsx` - Status indicator
- `TemplateSelector.jsx` - Template dropdown with preview
- `ClientSelector.jsx` - Client selection dropdown

#### API Endpoints Required:
- `POST /api/v1/messages/send` - Send message
- `GET /api/v1/messages` - Get message history
- `GET /api/v1/messages/{id}` - Get message details
- `POST /api/v1/messages/{id}/retry` - Retry failed message

---

### 4. **Templates Screen** (`/templates`)

#### Features:
- **Template List View**
  - Grid/List of all message templates
  - Template name, preview, created date
  - Quick actions (Use, Edit, Delete, Duplicate)
  
- **Create/Edit Template**
  - Template name (required)
  - Template content (text area with variable placeholders)
  - Variable hints (e.g., {{name}}, {{phone}})
  - Preview section
  - Save button
  
- **Template Usage**
  - Quick "Use Template" button
  - Redirects to Messages screen with template pre-filled

#### UI Components Needed:
- `TemplateList.jsx` - Template grid/list
- `TemplateForm.jsx` - Create/Edit form
- `TemplateCard.jsx` - Individual template card
- `TemplatePreview.jsx` - Preview with sample data
- `VariableHelper.jsx` - Variable syntax helper

#### API Endpoints Required:
- `GET /api/v1/templates` - List all templates
- `POST /api/v1/templates` - Create template
- `GET /api/v1/templates/{id}` - Get template details
- `PUT /api/v1/templates/{id}` - Update template
- `DELETE /api/v1/templates/{id}` - Delete template

---

### 5. **Enhanced Dashboard** (`/dashboard`)

#### Additional Features:
- **Real-time Statistics**
  - Messages Sent (total count)
  - Clients (total count)
  - Templates (total count)
  - Messages Today/This Week/This Month
  - Success Rate (delivered vs failed)
  
- **Quick Actions**
  - "Send Message" button → Navigate to Messages
  - "Add Client" button → Navigate to Clients
  - "Create Template" button → Navigate to Templates
  
- **Recent Activity**
  - Recent messages sent (last 5-10)
  - Recent clients added
  - Status updates
  
- **Charts/Graphs** (optional)
  - Message volume over time
  - Status distribution pie chart

#### API Endpoints Required:
- `GET /api/v1/dashboard/stats` - Get dashboard statistics
- `GET /api/v1/messages?limit=10` - Recent messages
- `GET /api/v1/clients?limit=5` - Recent clients

---

### 6. **Additional Screens (Optional but Recommended)**

#### **Message Detail Screen** (`/messages/:id`)
- Full message details
- Delivery timeline
- Status history
- Error details (if failed)
- Retry option

#### **Client Detail Screen** (`/clients/:id`)
- Client information
- Message history with this client
- Edit client info
- Send message to this client

#### **Settings/Profile Screen** (`/settings`)
- User profile information
- Company information
- Change password
- API settings (if needed)

---

## Technical Implementation Approach

### 1. **Shared Layout Component**
```jsx
// Layout.jsx structure
- Sidebar (navigation)
- Header (user info, logout)
- Main content area (outlet for routes)
```

### 2. **State Management**
- Use React Query for server state (already set up)
- Local state for forms (useState)
- Context for global UI state (loading, errors)

### 3. **API Service Layer**
Create service files:
- `services/clients.js` - Client API calls
- `services/messages.js` - Message API calls
- `services/templates.js` - Template API calls
- `services/dashboard.js` - Dashboard API calls

### 4. **Custom Hooks**
- `useClients.js` - Client data fetching and mutations
- `useMessages.js` - Message data fetching and mutations
- `useTemplates.js` - Template data fetching and mutations
- `useDashboard.js` - Dashboard statistics

### 5. **Reusable Components**
- `Modal.jsx` - Reusable modal component
- `Button.jsx` - Styled button component
- `Input.jsx` - Form input component
- `Select.jsx` - Dropdown select component
- `Table.jsx` - Data table component
- `LoadingSpinner.jsx` - Loading indicator
- `ErrorMessage.jsx` - Error display component

### 6. **Form Validation**
- Client-side validation using simple checks
- Display validation errors inline
- Disable submit button when form is invalid

---

## UI/UX Design Approach

### Design Principles:
1. **Consistency**
   - Same header/sidebar across all pages
   - Consistent button styles
   - Consistent color scheme (match current dashboard)

2. **User Experience**
   - Clear navigation
   - Loading states for async operations
   - Success/error notifications
   - Confirmation dialogs for destructive actions

3. **Responsive Design**
   - Mobile-friendly (responsive tables, collapsible sidebar)
   - Works on tablets and desktops

4. **Visual Hierarchy**
   - Primary actions (Send, Add) prominent
   - Secondary actions (Edit, Delete) less prominent
   - Clear status indicators

### Color Scheme (matching current dashboard):
- Primary: #667eea (purple/blue gradient)
- Success: Green
- Error: Red (#dc3545)
- Warning: Yellow/Orange
- Background: #f5f5f5 (light grey)
- Cards: White with shadow

---

## Implementation Priority

### Phase 1: Core Functionality (Essential)
1. ✅ Shared Layout with Navigation
2. ✅ Clients Screen (CRUD)
3. ✅ Messages Screen (Send + History)
4. ✅ Templates Screen (CRUD)
5. ✅ Enhanced Dashboard (real data)

### Phase 2: Enhanced Features (Important)
1. Message Detail View
2. Client Detail View
3. Bulk operations (bulk send, bulk delete)
4. Advanced filtering/search

### Phase 3: Nice to Have (Optional)
1. Settings/Profile page
2. Charts and analytics
3. Export functionality
4. Notifications system

---

## File Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Layout.jsx          # Main layout with sidebar
│   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   ├── Header.jsx           # Top header
│   │   ├── Modal.jsx            # Reusable modal
│   │   ├── Button.jsx           # Styled button
│   │   ├── Input.jsx            # Form input
│   │   ├── Select.jsx           # Dropdown
│   │   ├── Table.jsx            # Data table
│   │   ├── LoadingSpinner.jsx   # Loading indicator
│   │   └── ErrorMessage.jsx    # Error display
│   ├── clients/
│   │   ├── ClientList.jsx
│   │   ├── ClientForm.jsx
│   │   ├── ClientCard.jsx
│   │   └── ClientSearch.jsx
│   ├── messages/
│   │   ├── MessageComposer.jsx
│   │   ├── MessageList.jsx
│   │   ├── MessageCard.jsx
│   │   ├── MessageStatusBadge.jsx
│   │   ├── TemplateSelector.jsx
│   │   └── ClientSelector.jsx
│   └── templates/
│       ├── TemplateList.jsx
│       ├── TemplateForm.jsx
│       ├── TemplateCard.jsx
│       └── TemplatePreview.jsx
├── pages/
│   ├── Dashboard.jsx           # Enhanced with real data
│   ├── Clients.jsx              # Full implementation
│   ├── Messages.jsx             # Full implementation
│   ├── Templates.jsx            # Full implementation
│   ├── MessageDetail.jsx        # Optional
│   └── ClientDetail.jsx         # Optional
├── services/
│   ├── clients.js               # Client API calls
│   ├── messages.js              # Message API calls
│   ├── templates.js             # Template API calls
│   └── dashboard.js             # Dashboard API calls
└── hooks/
    ├── useClients.js            # Client hooks
    ├── useMessages.js           # Message hooks
    ├── useTemplates.js          # Template hooks
    └── useDashboard.js          # Dashboard hooks
```

---

## Backend API Requirements

**Note:** Some backend endpoints need to be implemented. Current status:
- ✅ Auth endpoints (signup, login) - Working
- ⚠️ Client endpoints - Placeholder (need implementation)
- ⚠️ Message endpoints - Placeholder (need implementation)
- ⚠️ Template endpoints - Not created yet (need to create)

**Required Backend Work:**
1. Implement client CRUD endpoints
2. Implement message send and list endpoints
3. Create template CRUD endpoints
4. Create dashboard stats endpoint

---

## Questions for Approval

1. **Navigation Style**: Sidebar or top navigation bar?
2. **Client List Style**: Table or card grid?
3. **Message Composer**: Separate page or modal on Messages page?
4. **Template Variables**: What format? (e.g., {{name}}, {name}, $name)
5. **Bulk Operations**: Needed in Phase 1 or later?
6. **Real-time Updates**: WebSocket for message status updates, or polling?

---

## Next Steps (After Approval)

1. Implement shared Layout component with navigation
2. Create API service functions
3. Create custom hooks for data fetching
4. Implement Clients screen
5. Implement Messages screen
6. Implement Templates screen
7. Enhance Dashboard with real data
8. Add loading states and error handling
9. Add form validation
10. Test all functionality

---

**Please review this approach and let me know:**
- ✅ Which screens to prioritize
- ✅ Any changes to the proposed features
- ✅ UI/UX preferences
- ✅ Any additional screens needed
- ✅ Approval to proceed with implementation
