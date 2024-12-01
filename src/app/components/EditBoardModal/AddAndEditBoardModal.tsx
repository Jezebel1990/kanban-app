import { Modal, ModalBody } from "../Modal/Modal";
import { useAppSelector, useAppDispatch } from "@/components/redux/hooks";

import {
    getAddAndEditBoardModalValue,
    getAddAndEditBoardModalVariantValue,
    closeAddAndEditBoardModal,
    } from "@/components/redux/features/appSlice";


export default function AddAndEditBoardModal() {
    const modalVariant = useAppSelector(getAddAndEditBoardModalVariantValue);
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector(getAddAndEditBoardModalValue);
    const closeModal = () => dispatch(closeAddAndEditBoardModal());

 return (
   <Modal isOpen={isOpen} onRequestClose={closeModal}>
     <ModalBody>
      <p>{modalVariant}</p>
     </ModalBody>
   </Modal>
 );
}