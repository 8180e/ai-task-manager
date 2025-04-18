import { vi, describe, it, expect } from "vitest";
import { get } from "../../../src/services/tasks.service";
import Task from "../../../src/models/task.model";
import { NotFoundError, ForbiddenError } from "../../../src/utils/errors.util";

vi.spyOn(Task, "findById");

describe("get task", () => {
  it("returns task with matching user ID", async () => {
    const task = {
      taskId: "test-task-id",
      userId: { equals: () => true },
      description: "test task",
    };

    vi.mocked(Task.findById).mockResolvedValue(task);

    const result = await get("test-user-id", "test-task-id");
    expect(result).toEqual(task);
  });

  it("throws ForbiddenError with non-matching user ID", async () => {
    const task = {
      userId: { equals: () => false },
      description: "test task",
    };

    vi.mocked(Task.findById).mockResolvedValue(task);

    await expect(
      get("non-matching-user-id", "test-task-id")
    ).rejects.toThrowError(ForbiddenError);
  });

  it("throws NotFoundError when task is not found", async () => {
    vi.mocked(Task.findById).mockResolvedValue(null);

    await expect(get("test-user-id", "test-task-id")).rejects.toThrowError(
      NotFoundError
    );
  });
});
