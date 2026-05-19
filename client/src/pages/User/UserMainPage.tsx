import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useModal } from "../../hooks/useModal";
import { useRefresh } from "../../hooks/useRefresh";
import { useToastMessage } from "../../hooks/useToastMessage";
import type { UserColumns } from "../../Interfaces/UserInterface";
import AddUserFormModal from "./components/AddUserFormModal";
import DeleteUserFormModal from "./components/DeleteUserFormModal";
import EditUserFormModal from "./components/EditUserFormModal";
import UserList from "./components/UserList";

const UserMainPage = () => {
  const toast = useToastMessage("", false, false);
  const { refresh, handleRefresh } = useRefresh(false);
  const addModal = useModal(false);
  const editModal = useModal<UserColumns>(false);
  const deleteModal = useModal<UserColumns>(false);

  return (
    <>
      <ToastMessage
        message={toast.message}
        isFailed={toast.isFailed}
        isVisible={toast.isVisible}
        onClose={toast.closeToastMessage}
      />
      <AddUserFormModal
        isOpen={addModal.isOpen}
        onClose={addModal.closeModal}
        onSaved={(msg) => {
          toast.showToastMessage(msg);
          handleRefresh();
        }}
      />
      <EditUserFormModal
        user={editModal.selected}
        isOpen={editModal.isOpen}
        onClose={editModal.closeModal}
        onSaved={(msg) => {
          toast.showToastMessage(msg);
          handleRefresh();
        }}
      />
      <DeleteUserFormModal
        user={deleteModal.selected}
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onDeleted={(msg) => {
          toast.showToastMessage(msg);
          handleRefresh();
        }}
      />
      <UserList
        refreshKey={refresh}
        onAdd={() => addModal.openModal()}
        onEdit={(u) => editModal.openModal(u)}
        onDelete={(u) => deleteModal.openModal(u)}
      />
    </>
  );
};

export default UserMainPage;
