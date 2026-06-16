# Gemini Tool Mapping & Platform Workflows

Superpowers skills use Claude Code tool names by default. When operating on Gemini-based platforms, translate those tool references using the guidelines below.

---

## Tool Mapping Table

| Claude Code (Skill Reference) | Gemini CLI Equivalent | Antigravity IDE Equivalent | Purpose |
| :--- | :--- | :--- | :--- |
| **`Read`** | `read_file` | `default_api:view_file` | Read the content of a file |
| **`Write`** | `write_file` | `default_api:write_to_file` | Create a new file |
| **`Edit`** | `replace` | `default_api:replace_file_content` / `default_api:multi_replace_file_content` | Modify lines in an existing file |
| **`Bash`** | `run_shell_command` | `default_api:run_command` | Execute shell commands |
| **`Grep`** | `grep_search` | `default_api:grep_search` | Search files for matching text patterns |
| **`Glob`** | `glob` / `list_directory` | `default_api:list_dir` | List files and directories |
| **`TodoWrite`** | `write_todos` / `tracker_create_task` | `task.md` workflow | Track implementation checklists |
| **`Skill`** | `activate_skill` | Natively active (loaded automatically) | Load and apply skill instructions |
| **`WebSearch`** | `google_web_search` | `default_api:search_web` | Perform search queries on the web |
| **`WebFetch`** | `web_fetch` | `default_api:read_url_content` | Retrieve raw webpage content |
| **`Task`** (subagent) | `@agent-name` syntax | `default_api:browser_subagent` | Delegate tasks to a subagent |

---

## 1. Skill Loading & Activation

### Gemini CLI
- Skills must be explicitly loaded using the `activate_skill` tool.
- At the start of a session, Gemini loads skill metadata and waits for you to activate a skill when its condition is met.

### Antigravity IDE
- **Natively Active:** Skills listed in `GEMINI.md` are automatically loaded into your context by the IDE harness.
- You do **not** need to call any activation tool. Simply identify when a skill's rules apply and follow them directly.

---

## 2. Planning Mode

Planning Mode ensures structured, low-risk changes by separating research from execution.

### Gemini CLI
- Toggle planning mode using `enter_plan_mode` and `exit_plan_mode`.
- Perform read-only exploration inside plan mode before executing changes.

### Antigravity IDE
- **Artifact-Driven:** Switch to planning mode by creating or updating the `implementation_plan.md` artifact (setting `RequestFeedback: true`).
- **User Gate:** You must wait for explicit or automated user approval of the plan before proceeding to make code edits or run modifying commands.
- During execution, maintain a living checklist in `task.md` using `default_api:write_to_file` or `default_api:replace_file_content`.
- Upon completion, summarize outcomes in the `walkthrough.md` artifact.

---

## 3. Subagent Support

### Gemini CLI
- Supports native subagent dispatching via the `@` prefix (e.g., `@generalist` or `@code-reviewer`).
- When requested to run a task, invoke the target agent using the appropriate prompt template (e.g., `implementer-prompt.md`, `code-quality-reviewer-prompt.md`) with all placeholders filled.
- Support for parallel execution is native; issue multiple `@generalist` requests in the same prompt if they are independent.

### Antigravity IDE
- **Interactive Browser Subagent:** Use `default_api:browser_subagent` to run an autonomous agent inside a browser environment (for UI verification, visual testing, etc.).
- Provide a clear, step-by-step task description, custom recording name, and final report criteria.

---

## 4. Asynchronous & Background Tasks

### Gemini CLI
- Uses persistent background bash sessions.
- Control tasks via tools like `write_bash` (send input), `read_bash` (view stdout), and `stop_bash` (terminate).

### Antigravity IDE
- **Background Processes:** Run long-running commands (servers, test loops) with `default_api:run_command` by specifying a `WaitMsBeforeAsync` threshold (up to `10000`ms).
- **Task Management:** Use `default_api:manage_task` with action `status`, `send_input`, or `kill` to interact with background processes using their unique task IDs. Do not poll in a loop; wait for completion notifications.

---

## 5. Additional Antigravity IDE Tools

Leverage these tools to optimize human-agent collaboration and UI design:

- **`default_api:ask_question`:** Present interactive, multi-choice modals to clarify ambiguity. Do not ask simple yes/no questions with this; use text instead.
- **`default_api:generate_image`:** Create mockup designs, generate placeholder graphics, or edit existing visual layouts to wow the user.
- **`default_api:schedule`:** Create one-shot reminders or recurring cron loops to check build/deploy statuses in the background.
- **`default_api:ask_permission`:** Prompt for additional scopes if encountering a file system permission block.
