import { Edit2 } from "lucide-react";
import type { Memo } from "../../types/calendar";

interface MemoListProps {
  memos: Memo[];
  emptyMessage: string;
  onEditMemo: (memo: Memo) => void;
}

export default function MemoList({
  memos,
  emptyMessage,
  onEditMemo,
}: MemoListProps) {
  if (memos.length === 0) {
    return (
      <div className="py-6 text-center text-gray-400">
        <p className="text-xs">{emptyMessage}</p>
        <p className="text-xs mt-0.5">메모를 작성해보세요!</p>
      </div>
    );
  }

  return (
    <div className="pr-2 space-y-3 overflow-y-auto max-h-[600px] snap-y snap-mandatory">
      {memos.map((memo) => (
        <div
          key={memo.id}
          className="p-4 transition-all bg-white border-2 rounded-lg hover:shadow-sm snap-start"
          style={{ borderColor: memo.color }}
        >
          <div className="flex items-start justify-between mb-2.5">
            <div className="flex items-center flex-1 space-x-2.5">
              <div
                className="flex-shrink-0 w-3 h-3 rounded-full"
                style={{ backgroundColor: memo.color }}
              />
              <h4 className="text-sm font-semibold text-gray-900">
                {memo.title || "제목 없음"}
              </h4>
            </div>
            <button
              onClick={() => onEditMemo(memo)}
              className="p-1 text-gray-400 transition-colors hover:text-blue-600"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-xs text-gray-600 whitespace-pre-wrap mb-2.5">
            {memo.content}
          </p>
          <div className="flex items-center justify-between text-[10px] text-gray-400">
            <span>
              {new Date(memo.date).toLocaleDateString("ko-KR", {
                month: "short",
                day: "numeric",
              })}
            </span>
            <span>
              {memo.updatedAt.toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
