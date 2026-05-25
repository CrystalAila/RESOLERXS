import { useCallback, useEffect, useRef, useState, type FC } from "react";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";
import type { UserColumns } from "../../../Interfaces/UserInterface";
import UserService from "../../../services/UserService";
import { parsePaginatedResponse } from "../../../utils/pagination";

interface UserListProps {
  refreshKey: boolean;
  onAdd: () => void;
  onEdit: (user: UserColumns) => void;
  onDelete: (user: UserColumns) => void;
}

const UserList: FC<UserListProps> = ({ refreshKey, onAdd, onEdit, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserColumns[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const tableRef = useRef<HTMLDivElement>(null);

  const load = async (p: number, append: boolean, q: string) => {
    try {
      setLoading(true);
      const res = await UserService.loadUsers(p, q);
      const { data, currentPage, lastPage: lp } = parsePaginatedResponse<UserColumns>(res.data.users);
      setUsers(append ? [...users, ...data] : data);
      setPage(currentPage);
      setHasMore(currentPage < lp);
    } catch {
      if (!append) setUsers([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setUsers([]);
    setPage(1);
    setHasMore(true);
    load(1, false, debouncedSearch);
  }, [refreshKey, debouncedSearch]);

  const handleScroll = useCallback(() => {
    const ref = tableRef.current;
    if (ref && ref.scrollTop + ref.clientHeight >= ref.scrollHeight - 10 && hasMore && !loading) {
      load(page + 1, true, debouncedSearch);
    }
  }, [hasMore, loading, page, debouncedSearch, users]);

  useEffect(() => {
    const ref = tableRef.current;
    ref?.addEventListener("scroll", handleScroll);
    return () => ref?.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Users</h1>
        <p className="mt-1 text-rx-muted">Manage staff and admin accounts</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-rx-border bg-rx-card">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-rx-border p-4">
          <div className="w-64">
            <FloatingLabelInput label="Search" name="user_search" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button type="button" onClick={onAdd} className="rounded-lg bg-rx-accent px-4 py-2 text-sm font-bold uppercase text-white hover:bg-rx-accent-hover">
            Add User
          </button>
        </div>
        <div ref={tableRef} className="max-h-[calc(100vh-14rem)] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 border-b border-rx-border bg-rx-surface text-xs uppercase text-rx-muted">
              <TableRow>
                <TableCell isHeader className="px-4 py-3">Name</TableCell>
                <TableCell isHeader className="px-4 py-3">Username</TableCell>
                <TableCell isHeader className="px-4 py-3">Role</TableCell>
                <TableCell isHeader className="px-4 py-3 text-center">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-rx-border text-sm">
              {users.map((u) => (
                <TableRow key={u.user_id} className="hover:bg-white/5">
                  <TableCell className="px-4 py-3 font-medium">{u.name}</TableCell>
                  <TableCell className="px-4 py-3 text-rx-muted">{u.username}</TableCell>
                  <TableCell className="px-4 py-3 uppercase">{u.role}</TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex justify-center gap-3">
                      <button type="button" className="text-emerald-400 hover:underline" onClick={() => onEdit(u)}>Edit</button>
                      <button type="button" className="text-rx-accent hover:underline" onClick={() => onDelete(u)}>Delete</button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-rx-muted">No users found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
