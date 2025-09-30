"use client";

import { useState } from "react";
import { TasksService } from "@/services/tasksService";
import { PostsService } from "@/services/postsService";
import { Button } from "@/components/atoms/ui/button";

export function ApiTest() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState<string | null>(null);

  const testApi = async (testName: string, apiCall: () => Promise<any>) => {
    setLoading(testName);
    try {
      const result = await apiCall();
      setResults((prev: any) => ({
        ...prev,
        [testName]: { success: true, data: result },
      }));
    } catch (error: any) {
      setResults((prev: any) => ({
        ...prev,
        [testName]: { success: false, error: error.message },
      }));
    } finally {
      setLoading(null);
    }
  };

  const tests = [
    {
      name: "Get Tasks by Year (2025)",
      call: () => TasksService.getTasksByYear(2025),
    },
    {
      name: "Get Tasks by Division and Year",
      call: () => TasksService.getTasksByDivisionAndYear("frontend", 2025),
    },
    {
      name: "Get All Posts",
      call: () => PostsService.getAllPosts(),
    },
    {
      name: "Create Task",
      call: () =>
        TasksService.createTask({
          title: "Test Task",
          description: "Test Description",
          division_id: "1",
        }),
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">API Test Dashboard</h2>
      
      <div className="grid gap-2">
        {tests.map((test) => (
          <Button
            key={test.name}
            onClick={() => testApi(test.name, test.call)}
            disabled={loading === test.name}
            variant="outline"
            className="justify-start"
          >
            {loading === test.name ? "Testing..." : `Test: ${test.name}`}
          </Button>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Results:</h3>
        <div className="space-y-2">
          {Object.entries(results).map(([testName, result]: [string, any]) => (
            <div
              key={testName}
              className={`p-3 rounded border ${
                result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              }`}
            >
              <div className="font-medium">{testName}</div>
              <div className="text-sm mt-1">
                {result.success ? (
                  <pre className="text-green-700 overflow-auto max-h-32">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                ) : (
                  <div className="text-red-700">{result.error}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}