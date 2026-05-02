import { useRouter } from "next/router";
import { useNoteContext } from "../../contexts/NoteProvider";

export default function DeleteUser() {
  const router = useRouter();
  const { closeModal, fetchApi, resetStorage } = useNoteContext();

  function deleteUser() {
    closeModal();
    fetchApi({
      url: "api/auth/delete",
      method: "DELETE",
      onSuccess: () => {
        resetStorage();
        router.replace("/account/signup");
      },
    });
  }

  return (
    <div>
      <h3 className="font-bold">Delete Account?</h3>
      <p className="pb-2 text-sm text-red-600">This action is irreversible</p>
      <div className="space-x-2">
        <button className="btn" onClick={deleteUser}>
          Yes
        </button>
        <button className="btn" onClick={closeModal}>
          No
        </button>
      </div>
    </div>
  );
}
