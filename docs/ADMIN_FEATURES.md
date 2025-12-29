# Admin Features Documentation

## Overview

Administrators have full access to the Dreamaker platform with capabilities to manage users, view analytics, and moderate content. The admin role provides elevated permissions for platform oversight and user support.

---

## Core Admin Capabilities

### 1. User Management

#### Add Users by Email

Admins can invite new users to the platform by sending email invitations.

**Process:**
1. Admin navigates to User Management section
2. Admin enters user's email address (e.g., `isabella@projectconvoy.info`)
3. System sends invitation email to the specified address
4. User receives email with personalized invite to join Dreamaker
5. User clicks invite link and completes onboarding flow
6. Admin can see the new user appears in their user management dashboard

**Email Template:**
```
Subject: You're invited to join Dreamaker

Hi there!

You've been invited to join Dreamaker, a platform for turning your dreams 
into reality. Click the link below to get started:

[Accept Invitation]

Welcome to your journey of personal empowerment!

The Dreamaker Team
```

**Future Implementation:**
- Integration with email service provider (SendGrid/Postmark/AWS SES)
- Customizable invitation templates
- Bulk user import via CSV
- Invitation tracking (sent, opened, accepted, expired)
- Resend capability for expired or undelivered invitations
- Custom welcome messages per invitation

#### View All Users

Admins can view a comprehensive list of all users under their administration.

**User List Displays:**
- User name
- Email address
- Registration/join date
- Onboarding completion status
- Last active date
- Personal empowerment score
- Number of active dreams
- Account status (active, suspended, pending)

**Sorting & Filtering:**
- Sort by: name, date joined, last active, empowerment score
- Filter by: status, date range, score range
- Search by name or email

#### User Actions

**Available Actions:**
- **View Profile**: See full user profile and activity
- **View Dreams**: Access user's dreams and progress
- **View Analytics**: See individual user analytics
- **Edit Details**: Update user information (name, email)
- **Suspend Account**: Temporarily disable user access
- **Delete Account**: Permanently remove user and data
- **Reset Password**: Trigger password reset email
- **View Activity Log**: See user's platform activity history
- **Send Message**: Direct communication with user

**Permissions:**
- Only admins can perform these actions
- All actions are logged in audit trail
- Certain actions require confirmation (delete, suspend)
- User receives notification for impactful changes

---

### 2. Analytics Dashboard

The analytics dashboard provides admins with insights into platform usage, user engagement, and the effectiveness of the Dreamaker platform in empowering users.

#### Personal Empowerment Score

**Overview:**

The Personal Empowerment Score (PES) is the primary metric for measuring user engagement, progress, and overall empowerment through their journey on the Dreamaker platform. This score combines multiple data sources to provide a holistic view of user success.

**Score Range:** 0-100
- **0-49**: Low empowerment (needs support)
- **50-79**: Medium empowerment (progressing well)
- **80-100**: High empowerment (thriving)

**Data Source:**

The PES is calculated using data from:
- **PostHog Survey Responses**: Direct user feedback
- **User Feedback Triggers**: In-app feedback submissions
- **Manual Surveys**: Periodic check-ins sent by admins
- **Behavioral Analytics**: Platform usage patterns
- **Goal Completion Metrics**: Dream and milestone progress

**Scoring Components:**

1. **Goal Completion Rate (25%)**
   - Progress on active dreams
   - Milestone achievement rate
   - Journal entry consistency
   - Vision clarity exercises completion

2. **Platform Engagement (20%)**
   - Login frequency
   - Feature usage (Sidekick, journal, vision board)
   - Session duration
   - Active days per month

3. **Self-Reported Confidence (25%)**
   - Survey responses about personal confidence
   - Self-assessment scores
   - Goal achievement beliefs
   - Future outlook ratings

4. **Community Participation (15%)**
   - Accountability partner interactions
   - Shared dreams participation
   - Support given to others
   - Platform community engagement

5. **Vision Clarity (15%)**
   - Completion of vision exercises
   - Dream definition quality
   - Goal specificity
   - Action plan development

**Dashboard Display:**

```
╔═════════════════════════════════════════════════════════════╗
║         PERSONAL EMPOWERMENT SCORE OVERVIEW                 ║
╠═════════════════════════════════════════════════════════════╣
║                                                             ║
║  Overall Platform Score: 78/100  ↑ 5pts this month        ║
║  Trend: ████████████████░░░░ Increasing                    ║
║                                                             ║
║  ┌─────────────────────────────────────────────────────┐   ║
║  │ INDIVIDUAL USER SCORES                              │   ║
║  ├─────────────────────────────────────────────────────┤   ║
║  │ User Name          Score    Trend      Last Survey  │   ║
║  ├─────────────────────────────────────────────────────┤   ║
║  │ Jane Doe            82      ↑ +8      2 days ago    │   ║
║  │ John Smith          74      → 0       5 days ago    │   ║
║  │ Alice Johnson       91      ↑ +12     1 day ago     │   ║
║  │ Bob Williams        68      ↓ -4      7 days ago    │   ║
║  │ Carol Martinez      85      ↑ +6      3 days ago    │   ║
║  └─────────────────────────────────────────────────────┘   ║
║                                                             ║
║  SCORE DISTRIBUTION                                         ║
║  ┌───────────────────────────────────────────────────┐     ║
║  │ High (80-100):   45% ████████████                 │     ║
║  │ Medium (50-79):  40% ██████████                   │     ║
║  │ Low (0-49):      15% ████                         │     ║
║  └───────────────────────────────────────────────────┘     ║
║                                                             ║
║  COMPONENT BREAKDOWN (Platform Average)                     ║
║  • Goal Completion:        72/100  ████████████░░░         ║
║  • Platform Engagement:    81/100  ████████████████░       ║
║  • Self-Reported Confidence: 76/100  ███████████████░░      ║
║  • Community Participation: 65/100  █████████████          ║
║  • Vision Clarity:         84/100  ████████████████░░      ║
║                                                             ║
╚═════════════════════════════════════════════════════════════╝
```

**Individual User View:**

When clicking on a user, admins see:
- Detailed score breakdown by component
- Historical score trends (chart)
- Recent survey responses
- Behavioral insights
- Recommended interventions
- Comparison to platform average

**Survey Management via PostHog:**

Admins can trigger and manage surveys directly from the dashboard:

**Manual Survey Triggers:**
1. Navigate to Analytics → Surveys
2. Select survey type:
   - Quick Check-in (3 questions, 2 minutes)
   - Empowerment Assessment (10 questions, 5 minutes)
   - Goal Progress Review (8 questions, 4 minutes)
   - Platform Feedback (5 questions, 3 minutes)
3. Select target users:
   - All users
   - Users with low PES (< 50)
   - Users with declining scores
   - Users who haven't been surveyed recently
   - Custom selection
4. Schedule:
   - Send immediately
   - Schedule for specific date/time
   - Set up recurring surveys
5. Review and send

**Survey Types:**

**1. Quick Check-in:**
- "How are you feeling about your progress today?"
- "What's one win you've had this week?"
- "Do you need any support?"

**2. Empowerment Assessment:**
- Confidence level ratings
- Goal clarity assessment
- Progress satisfaction
- Obstacles identification
- Support needs
- Platform usefulness ratings

**3. Goal Progress Review:**
- Progress on specific dreams
- Milestone achievement
- Challenge areas
- Action plan effectiveness
- Accountability partner value

**4. Platform Feedback:**
- Feature usage satisfaction
- New feature requests
- Bug reports
- User experience ratings
- Improvement suggestions

**PostHog Integration Details:**

```javascript
// Example: Trigger survey via PostHog
posthog.capture('admin_triggered_survey', {
  survey_type: 'empowerment_assessment',
  target_users: ['user_id_1', 'user_id_2'],
  triggered_by: 'admin_id',
  timestamp: Date.now()
});

// PostHog receives responses and feeds back to analytics
posthog.onFeatureFlags((flags) => {
  if (flags['survey_response_received']) {
    // Update PES calculation
    recalculatePersonalEmpowermentScore(userId);
  }
});
```

**Analytics Data Pipeline:**

```
┌──────────────┐
│   PostHog    │
│   Surveys    │
└──────┬───────┘
       │
       ↓ Survey Responses
┌──────────────────┐
│  Data Pipeline   │
│  (Processing)    │
└──────┬───────────┘
       │
       ↓ Calculated Metrics
┌──────────────────┐
│   Supabase       │
│   (Storage)      │
└──────┬───────────┘
       │
       ↓ Real-time Updates
┌──────────────────┐
│  Admin Dashboard │
│  (Display)       │
└──────────────────┘
```

**Key Metrics Displayed:**

**Platform-Wide:**
- Average PES score
- Score trends over time
- Distribution across ranges
- Survey response rates
- Active users count
- Dreams completion rate

**Per-User:**
- Individual PES score
- Score trend line
- Component breakdown
- Survey response history
- Goal progress
- Platform engagement metrics

**Alerts & Notifications:**

Admins receive alerts for:
- User scores dropping below 50
- User not responding to surveys
- Significant score improvements (celebrate!)
- Users needing intervention
- Survey completion milestones

---

### 3. Content Moderation

**Status:** Placeholder for Future Implementation

Planned capabilities for content moderation features:

#### Review Queue

**User-Generated Content Types:**
- Dream titles and descriptions
- Journal entries (if flagged)
- User profile information
- Comments and messages
- Uploaded images

#### Moderation Actions

**Available Actions:**
- **Approve**: Content is appropriate, no action needed
- **Flag**: Mark for further review
- **Edit**: Modify inappropriate content
- **Hide**: Remove from public view but keep in user's account
- **Delete**: Permanently remove content
- **Warn User**: Send warning message to user
- **Suspend Content Creation**: Temporarily block user from creating content

#### Automated Filtering

**Planned Features:**
- Keyword filtering (profanity, hate speech)
- AI-powered content analysis
- Image moderation (inappropriate images)
- Spam detection
- Automated flagging based on community reports

#### User Reporting System

**Report Categories:**
- Inappropriate content
- Spam or misleading
- Harassment or bullying
- Privacy violation
- Other concerns

**Report Workflow:**
1. User submits report
2. Report appears in moderation queue
3. Admin reviews reported content
4. Admin takes appropriate action
5. Reporter receives notification of outcome
6. User who posted content is notified (if applicable)

#### Moderation Dashboard

```
╔════════════════════════════════════════════════════╗
║        CONTENT MODERATION QUEUE                    ║
╠════════════════════════════════════════════════════╣
║                                                    ║
║  Pending Review: 3 items                          ║
║  Flagged Today: 1 item                            ║
║  Resolved This Week: 12 items                     ║
║                                                    ║
║  ┌────────────────────────────────────────────┐   ║
║  │ Type        Content Preview      Action    │   ║
║  ├────────────────────────────────────────────┤   ║
║  │ Dream       "Inappropriate text..."        │   ║
║  │ Journal     "Potential violation..."       │   ║
║  │ Comment     "Flagged by user..."           │   ║
║  └────────────────────────────────────────────┘   ║
║                                                    ║
╚════════════════════════════════════════════════════╝
```

#### Audit Trail

All moderation actions logged:
- Action taken
- Content affected
- Admin who took action
- Timestamp
- Reason/notes
- User notified (yes/no)

#### Moderation Guidelines

Document defining:
- What content is prohibited
- When to warn vs. delete
- How to communicate with users
- Escalation procedures
- Appeals process

---

## Admin Dashboard Navigation

### Main Menu Items

**For Admin Users Only:**

```
┌─────────────────────────┐
│  Admin Dashboard        │
├─────────────────────────┤
│  👥 User Management     │
│  📊 Analytics           │
│  🛡️  Content Moderation  │
│  📧 Communications      │
│  ⚙️  Settings            │
└─────────────────────────┘
```

### Quick Actions

Always visible quick action buttons:
- Add New User
- Send Survey
- View Reports
- System Health

---

## Access Requirements & Security

### Admin Role Assignment

**How Users Get Admin Role:**

1. **During Onboarding:**
   - User selects "Admin" from role dropdown
   - First user on platform should be admin

2. **Granted by Existing Admin:**
   - Admin navigates to User Management
   - Selects user profile
   - Changes role from "User" to "Admin"
   - User receives notification of role change

3. **Cannot Self-Assign:**
   - Users cannot change their own role to admin
   - Prevents unauthorized access elevation

### Row Level Security (RLS)

**Supabase Security Policies:**

```sql
-- Only admins can view all user profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    role = 'admin' OR id = auth.uid()
  );

-- Only admins can update other users' profiles
CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can delete users
CREATE POLICY "Admins can delete users"
  ON profiles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can view all dreams (for moderation)
CREATE POLICY "Admins can view all dreams"
  ON dreams FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Audit Logging

**All admin actions are logged:**

```sql
CREATE TABLE admin_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES profiles(id),
  action_type TEXT NOT NULL,
  target_type TEXT, -- 'user', 'content', 'survey', etc.
  target_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Example log entry
{
  "admin_id": "admin-uuid",
  "action_type": "user_invited",
  "target_type": "user",
  "target_id": "new-user-uuid",
  "details": {
    "email": "isabella@projectconvoy.info",
    "invitation_sent": true
  },
  "created_at": "2025-01-15T10:30:00Z"
}
```

**Logged Actions:**
- User invitations sent
- User role changes
- User suspensions/deletions
- Content moderation actions
- Survey triggers
- Profile updates
- Settings changes
- Analytics exports

### Permission Validation

**Client-Side (UX):**
```tsx
// Hide admin features from non-admins
import { useHasRole } from '@/components/ProtectedRoute';

function Navigation() {
  const isAdmin = useHasRole('admin');
  
  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      {isAdmin && <NavLink to="/admin">Admin</NavLink>}
    </nav>
  );
}
```

**Server-Side (Security):**
```typescript
// Supabase Edge Function example
import { createClient } from '@supabase/supabase-js';

export async function validateAdminAccess(authHeader: string) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const token = authHeader.replace('Bearer ', '');
  const { data: { user } } = await supabase.auth.getUser(token);

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw new Error('Admin access required');
  }

  return user;
}
```

---

## Implementation Roadmap

### Phase 1: Foundation (Current)
- ✅ Admin role defined in database
- ✅ Admin role selection in onboarding
- ✅ Basic RLS policies
- ⏳ Admin dashboard route

### Phase 2: User Management (Next)
- ⏳ User list view
- ⏳ User detail view
- ⏳ Invite user functionality
- ⏳ Email integration
- ⏳ User actions (suspend, delete, etc.)

### Phase 3: Analytics (Priority)
- ⏳ PostHog integration
- ⏳ Survey management interface
- ⏳ PES calculation engine
- ⏳ Analytics dashboard UI
- ⏳ Individual user analytics
- ⏳ Trend visualization

### Phase 4: Content Moderation (Future)
- ⏳ Moderation queue
- ⏳ Review workflow
- ⏳ Automated filtering
- ⏳ User reporting system
- ⏳ Moderation guidelines

### Phase 5: Advanced Features (Future)
- ⏳ Bulk operations
- ⏳ Advanced reporting
- ⏳ Role management UI
- ⏳ Communication tools
- ⏳ Platform settings

---

## Best Practices

### For Admins

1. **User Privacy:**
   - Only access user data when necessary
   - Respect user confidentiality
   - Be transparent about data usage

2. **Communication:**
   - Be supportive and encouraging
   - Respond promptly to user concerns
   - Maintain professional tone

3. **Moderation:**
   - Apply guidelines consistently
   - Give warnings before taking harsh actions
   - Document reasons for actions

4. **Analytics:**
   - Use data to help users, not judge them
   - Look for patterns and opportunities
   - Celebrate user successes

5. **Security:**
   - Keep admin credentials secure
   - Log out when done
   - Report suspicious activity

### For Developers

1. **Always validate admin role server-side**
2. **Log all admin actions for audit trail**
3. **Use RLS policies for data protection**
4. **Implement rate limiting on admin actions**
5. **Regular security audits**
6. **Data anonymization for analytics**

---

## Support & Resources

### Admin Support

**Getting Help:**
- Admin documentation (this file)
- Platform guidelines
- Technical support contact
- Admin community forum

**Training:**
- Admin onboarding checklist
- Video tutorials
- Best practices guide
- Scenario walkthroughs

### Technical Details

**API Endpoints:** (To be implemented)
- `POST /api/admin/users/invite`
- `GET /api/admin/users`
- `PUT /api/admin/users/:id`
- `DELETE /api/admin/users/:id`
- `GET /api/admin/analytics/pes`
- `POST /api/admin/surveys/trigger`

**Database Tables:**
- `profiles` (role column)
- `admin_audit_log` (action logging)
- `user_invitations` (invite tracking)
- `survey_responses` (PostHog data)
- `empowerment_scores` (PES calculations)

---

## Conclusion

The admin features provide powerful tools for platform management while maintaining user privacy and security. This system enables admins to:

✅ Invite and manage users  
✅ Monitor platform health via analytics  
✅ Ensure content quality through moderation  
✅ Support users in their empowerment journey  

All while respecting user privacy and maintaining security best practices.

---

**Last Updated:** December 2025  
**Version:** 1.0  
**Status:** In Development

