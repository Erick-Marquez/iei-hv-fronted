import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
export default function SectionTable({ sections, visible, setVisible }) {


    function deleteSection(event, rowData) {
        confirmPopup({
            target: event.currentTarget,
            message: '¿Estas seguro que quieres eliminar la sección?',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Si',
            rejectLabel: 'No',
        });
    }

    const footerModalSection = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-danger" />
        </div>
    );

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <ConfirmPopup />
                <Button 
                    icon="pi pi-pencil" 
                    severity="warning"
                    tooltip="Cursos"
                    rounded 
                    className="mr-4" 
                    onClick={() => {
                        
                    }} 
                />
                <Button 
                    icon="pi pi-trash" 
                    severity="danger" 
                    tooltip="Secciones"
                    rounded 
                    className="mr-4" 
                    onClick={(e) => {
                        deleteSection(e, rowData)
                    }} 
                />
            </>
        );
    };

    return (
        <Dialog header={`Añadir Secciones a ${sections.description}`} visible={visible} style={{ width: '80vw', maxWidth: '1000px' }} onHide={() => setVisible(false)} footer={footerModalSection}>
            <div className="p-fluid">
                <DataTable value={sections.sections} rows={10} paginator rowsPerPageOptions={[5, 10, 25, 50]} removableSort responsiveLayout="scroll">
                    <Column field="section" header="Sección" sortable style={{ width: '22%' }} />
                    <Column field="shift" header="Turno" sortable style={{ width: '22%' }} />
                    <Column header="Acciones" body={actionBodyTemplate} style={{ width: '22%' }} />
                </DataTable>
            </div>
        </Dialog>
    )
}