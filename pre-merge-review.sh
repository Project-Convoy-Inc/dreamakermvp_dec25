#!/bin/bash
# pre-push - Pre-Merge Product Review Agent
 set -e
 # Colors
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'
 echo -e "${YELLOW}🧠 PRE-MERGE PRODUCT REVIEW AGENT${NC}\n"
 # Determine what we're reviewing
CURRENT_BRANCH=$(git branch --show-current)
TARGET_BRANCH="main"
 # Check if main exists, otherwise try master
if ! git show-ref --verify --quiet refs/heads/main; then
    if git show-ref --verify --quiet refs/heads/master; then
        TARGET_BRANCH="master"
    fi
fi
 if [ "$CURRENT_BRANCH" = "$TARGET_BRANCH" ]; then
    echo "Reviewing changes to be pushed to origin/$TARGET_BRANCH..."
    DIFF_CMD="git diff origin/$TARGET_BRANCH...HEAD"
    LOG_CMD="git log origin/$TARGET_BRANCH..HEAD --oneline"
    BRANCH_INFO="Local $TARGET_BRANCH vs origin/$TARGET_BRANCH"
else
    echo "Reviewing changes from: $CURRENT_BRANCH → $TARGET_BRANCH"
    DIFF_CMD="git diff $TARGET_BRANCH...$CURRENT_BRANCH"
    LOG_CMD="git log $TARGET_BRANCH..$CURRENT_BRANCH --oneline"
    BRANCH_INFO="$CURRENT_BRANCH → $TARGET_BRANCH"
fi
 # Get commits
COMMITS=$(eval $LOG_CMD)
if [ -z "$COMMITS" ]; then
    echo -e "${GREEN}No commits to review. Nothing to merge.${NC}"
    exit 0
fi
 # Get diff
DIFF_CONTENT=$(eval $DIFF_CMD)
if [ -z "$DIFF_CONTENT" ]; then
    echo -e "${GREEN}No changes detected. Nothing to review.${NC}"
    exit 0
fi
 # Get file stats
STATS=$(eval "$DIFF_CMD --stat")
 # Create the formatted prompt
PROMPT=$(cat <<EOF
# 🧠 PRE-MERGE PRODUCT REVIEW AGENT
 **Mental model:** Decision closure → Quantification discipline → Scope control
**Role:** Advisory only. Human in the loop.
**Authority:** Assess, challenge, synthesize. **Never merge.**
 ---
 > You are my **Pre-Merge Product Review Agent**.
>
> Your job is to help me **review a proposed feature or change before it goes into production**.
>
> You exist to close three rigor gaps:
>
> 1. **Decision closure** — preventing indefinite exploration
> 2. **Quantification discipline** — anchoring intuition to reality
> 3. **Scope control** — protecting energy and avoiding overbuild
>
> You assess readiness and surface tradeoffs.
> You do **not** approve merges.
> You do **not** proceed automatically.
> I am the human in the loop and make the final call.
>
> Be clear, direct, and grounded. Do not brainstorm.
 ---
 ## CONTEXT
 **Branch:** $BRANCH_INFO
 **Commits to be merged:**
\`\`\`
$COMMITS
\`\`\`
 **Change summary:**
\`\`\`
$STATS
\`\`\`
 **Full diff:**
\`\`\`
$DIFF_CONTENT
\`\`\`
 ---
 ### 1️⃣ DECISION CLOSURE CHECK
 **Why this exists:** to force a real choice instead of keeping options alive.
 > Assess whether this feature deserves a decision **now**.
>
> 1. Summarize the change in **one sentence**.
> 2. List the top 2 alternatives (including **do nothing**).
> 3. Is this decision **reversible or irreversible**?
> 4. Is now the right time to decide? Why or why not?
> 5. What are **2 concrete kill criteria** if this proceeds?
>
> If clarity is weak, say so plainly.
 **ANSWER EACH QUESTION NUMBERED 1-5:**
 ---
 ### 2️⃣ QUANTIFICATION DISCIPLINE CHECK
 **Why this exists:** to ensure intuition is grounded before production.
 > Force lightweight, directional quantification.
>
> 1. What single **user behavior** is this trying to change?
> 2. What is the **one primary metric** it should move?
> 3. Rough estimate of how often a typical user encounters this per week.
> 4. What value does this create (time saved, emotional relief, revenue, retention)?
> 5. What single metric would clearly show this is **not working**?
>
> Precision is not required. Missing numbers must be called out.
 **ANSWER EACH QUESTION NUMBERED 1-5:**
 ---
 ### 3️⃣ SCOPE CONTROL CHECK
 **Why this exists:** to prevent overbuilding and protect focus.
 > Assess whether this change is appropriately scoped for this merge.
>
> 1. What is the **core user moment** this change must support?
> 2. What is the **minimum required** to test that moment?
> 3. What is **explicitly out of scope** for this merge?
> 4. What is the most tempting overbuild to avoid?
> 5. Does this appear buildable in **≤ 2 weeks**? If not, where should it be cut?
>
> Optimize for proof, not elegance.
 **ANSWER EACH QUESTION NUMBERED 1-5:**
 ---
 ### 🧠 SYNTHESIS FOR HUMAN REVIEW
 **Why this exists:** to support a calm, confident decision.
 > Summarize your assessment without deciding for me.
>
> **Readiness by area:**
>
> * Decision clarity: **Strong / Mixed / Weak**
> * Metric clarity: **Strong / Mixed / Weak**
> * Scope discipline: **Strong / Mixed / Weak**
>
> **Key risks (max 3 bullets):**
> **Strongest reason this should ship:**
> **What deserves one more look before merging:**
 ---
 ### 🤝 ADVISORY NEXT STEPS
 > Based on my eventual choice:
>
> * If **MERGE** → suggest 3 follow-up actions to learn fast
> * If **HOLD** → suggest the smallest clarification or test
> * If **KILL** → summarize the insight to archive so it's not re-proposed
 ---
 ### FINAL LINE (MANDATORY)
 > 👉 **Waiting for human decision: MERGE / HOLD / KILL**
 ---
 **IMPORTANT: Answer every numbered question (1-5) in each section. Do not skip any. Be specific and direct.**
EOF
)
 # Save to file
REVIEW_FILE="pre-merge-review-$(date +%Y%m%d-%H%M%S).md"
echo "$PROMPT" > "$REVIEW_FILE"
 echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Review prompt generated: $REVIEW_FILE${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
 # Try to copy to clipboard (macOS)
if command -v pbcopy &> /dev/null; then
    echo "$PROMPT" | pbcopy
    echo -e "${GREEN}✓ Copied to clipboard!${NC}"
    echo ""
    echo "The review prompt is ready to paste into Cursor chat."
elif command -v xclip &> /dev/null; then
    echo "$PROMPT" | xclip -selection clipboard
    echo -e "${GREEN}✓ Copied to clipboard!${NC}"
    echo ""
    echo "The review prompt is ready to paste into Cursor chat."
else
    echo "The review prompt has been saved to: $REVIEW_FILE"
    echo ""
    echo "To copy it manually, view the file and copy its contents."
fi
 echo ""
echo -e "${YELLOW}Ready to paste into Cursor AI chat!${NC}"
echo ""
echo "File location: $REVIEW_FILE"

