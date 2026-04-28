import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";

export default function Messages() {
  const { token, user } = useAuth();
  const [searchParams] = useSearchParams();
  const threadIdFromUrl = searchParams.get("thread");

  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [banner, setBanner] = useState({ type: "", message: "" });
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  async function fetchThreads() {
    if (!token) {
      setBanner({
        type: "error",
        message: "You must be logged in to view messages.",
      });
      setLoadingThreads(false);
      return [];
    }

    try {
      setLoadingThreads(true);
      const res = await fetch(`${API_BASE_URL}/api/messages/threads`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load threads.");
      }

      setThreads(data);
      return data;
    } catch (error) {
      setBanner({
        type: "error",
        message: error.message || "Failed to load threads.",
      });
      return [];
    } finally {
      setLoadingThreads(false);
    }
  }

  async function fetchMessages(threadId) {
    try {
      setLoadingMessages(true);
      const res = await fetch(
        `${API_BASE_URL}/api/messages/threads/${threadId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load messages.");
      }

      setMessages(data);
    } catch (error) {
      setBanner({
        type: "error",
        message: error.message || "Failed to load messages.",
      });
    } finally {
      setLoadingMessages(false);
    }
  }

  useEffect(() => {
    async function init() {
      const loadedThreads = await fetchThreads();

      if (threadIdFromUrl && loadedThreads.length > 0) {
        const found = loadedThreads.find((t) => t._id === threadIdFromUrl);
        if (found) {
          setSelectedThread(found);
          fetchMessages(found._id);
          return;
        }
      }

      if (loadedThreads.length > 0) {
        setSelectedThread(loadedThreads[0]);
        fetchMessages(loadedThreads[0]._id);
      }
    }

    init();
  }, [token, threadIdFromUrl]);

  async function handleSelectThread(thread) {
    setSelectedThread(thread);
    await fetchMessages(thread._id);
  }

  async function handleSendMessage(e) {
    e.preventDefault();

    if (!text.trim() || !selectedThread) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/messages/threads/${selectedThread._id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send message.");
      }

      setMessages((prev) => [...prev, data.data]);
      setText("");
      fetchThreads();
    } catch (error) {
      setBanner({
        type: "error",
        message: error.message || "Failed to send message.",
      });
    }
  }

  function getOtherPerson(thread) {
    if (!user) return "User";
    if (thread.requester?._id === user._id) return thread.owner?.name || "Owner";
    return thread.requester?.name || "Requester";
  }

  return (
    <AppShell>
      <PageHeader
        title="Messages"
        description={
          user
            ? `Chat with other ShareLoop users, ${user.name}.`
            : "Your conversation threads."
        }
      />

      {banner.message && (
        <div
          className={`mt-6 rounded-2xl p-4 text-sm font-medium ${
            banner.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {banner.message}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="rounded-3xl bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900">Threads</h2>

          {loadingThreads ? (
            <p className="text-zinc-500">Loading threads...</p>
          ) : threads.length === 0 ? (
            <p className="text-zinc-500">No conversations yet.</p>
          ) : (
            <div className="space-y-3">
              {threads.map((thread) => (
                <button
                  key={thread._id}
                  onClick={() => handleSelectThread(thread)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedThread?._id === thread._id
                      ? "border-zinc-900 bg-zinc-50"
                      : "border-zinc-200 bg-white hover:bg-zinc-50"
                  }`}
                >
                  <p className="font-semibold text-zinc-900">
                    {thread.item?.title || "Item"}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    With {getOtherPerson(thread)}
                  </p>
                  <p className="mt-1 text-xs text-zinc-400">
                    📍 {thread.item?.location || "Unknown"}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-sm">
          {!selectedThread ? (
            <div className="flex h-full min-h-[420px] items-center justify-center text-zinc-500">
              Select a thread to view messages.
            </div>
          ) : (
            <div className="flex min-h-[420px] flex-col">
              <div className="border-b border-zinc-200 p-3">
                <h3 className="text-lg font-semibold text-zinc-900">
                  {selectedThread.item?.title || "Conversation"}
                </h3>
                <p className="text-sm text-zinc-500">
                  With {getOtherPerson(selectedThread)}
                </p>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {loadingMessages ? (
                  <p className="text-zinc-500">Loading messages...</p>
                ) : messages.length === 0 ? (
                  <p className="text-zinc-500">No messages yet. Start the conversation.</p>
                ) : (
                  messages.map((msg) => {
                    const mine = msg.sender?._id === user?._id;

                    return (
                      <div
                        key={msg._id}
                        className={`flex ${mine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                            mine
                              ? "bg-zinc-900 text-white"
                              : "bg-zinc-100 text-zinc-900"
                          }`}
                        >
                          <p className="text-xs opacity-70">
                            {msg.sender?.name || "User"}
                          </p>
                          <p className="mt-1 text-sm">{msg.text}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form
                onSubmit={handleSendMessage}
                className="border-t border-zinc-200 p-3"
              >
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="submit"
                    className="rounded-2xl bg-green-500 px-5 py-3 text-white transition hover:bg-green-600"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}