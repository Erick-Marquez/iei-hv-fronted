import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useRef, useState } from 'react';


import { Button } from 'primereact/button';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import BaseUrl from '../../fetch/BaseUrl';


//AXIOS//---------
axios.defaults.withCredentials = true

const Cursos = () => {
    const [ cursos, setCursos ] = useState([])
    const [ edit, setEdit ] = useState([])

    const nombreAdd = useRef('')

    const toast = useRef(null);
    const toastBC = useRef(null); //para las notificaciones

    useEffect(() => {
        getCursos()
    }, [])

    //AÑADIR CURSO

    const [visibleAdd, setVisibleAdd] = useState(false);
    const footerAdd = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" onClick={() => setVisibleAdd(false)} className="p-button-danger" />
            <Button label="Guardar" icon="pi pi-check" onClick={() => guardarCurso()} autoFocus style={{backgroundColor: "#2B3467"}}/>
        </div>
    );
    
    //EDITAR CURSO

    const [visibleEdit, setVisibleEdit] = useState(false);
    const footerEdit = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" onClick={() => setVisibleEdit(false)} className="p-button-danger" />
            <Button label="Actualizar" icon="pi pi-check" onClick={() => editarCurso()} autoFocus style={{backgroundColor: "#2B3467"}}/>
        </div>
    );
    
    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" severity="primary" rounded className="mr-4" onClick={() => {
                  setVisibleEdit(true)
                  setEdit({
                    id: rowData.id,
                    name: rowData.name
                  })
                }} />
                <Button icon="pi pi-trash" severity="danger" rounded onClick={() => eliminar(rowData)} />
            </>
        );
    };

    //ELIMINAR CURSO

    const eliminar = (rowData) => {
        toastBC.current.show({
            severity: 'info',
            sticky: true,
            className: 'border-none',
            content: (
                <div className="flex flex-column align-items-center" style={{ flex: '1' }}>
                    <div className="text-center">
                        <i className="pi pi-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
                        <div className="font-bold text-xl my-3">¿Estas seguro?</div>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={(e) => clear(true, rowData)} type="button" label="Confirm" className="p-button-success w-6rem" />
                        <Button onClick={(e) => clear(false, rowData)} type="button" label="Cancel" className="p-button-warning w-6rem" />
                    </div>
                </div>
            )
        });
    }

    const clear = (submit, rowData) => {
        toastBC.current.clear();
        if (submit) {

            BaseUrl.delete(`api/v1/courses/${rowData.id}`)
            .then((res) => {
                toast.current.show({ severity: 'success', summary: 'Eliminado', detail: 'Se elimino el curso' });
                getCursos()
            })
            .catch((err) => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el curso' });
            })
        }
    };


    //GET CURSO - AXIOS
    function getCursos() {
        BaseUrl.get("api/v1/courses") //Ocultando el axios para mayor accesibilidad -> BaseUrl.js
        .then((res) => {
            console.log(res);
            setCursos(res.data.data)
        })
        
    }

    //VALIDAR FORMULARIO

        //GUARDAR CURSO
    function guardarCurso() {
        console.log(nombreAdd.current.value)
        const dataCurso = {
            name: nombreAdd.current.value
        }
        BaseUrl.get("sanctum/csrf-cookie")
        .then(() => {

            BaseUrl.post("api/v1/courses", dataCurso)
            .then((res) => {
                console.log(res);
                getCursos()
                setVisibleAdd(false)
                toast.current.show({severity:'success', summary: 'Curso creado', detail:`Se añadio el curso ${dataCurso.name} `, life: 3000});
            })
            .catch((err) => {
                console.log(err);
            })

        })
    }

        //EDITAR CURSO
    function editarCurso(rarams) {
        const dataCurso = {
            name: edit.name
        }
        BaseUrl.get("sanctum/csrf-cookie")
        .then(() => {

            BaseUrl.put(`api/v1/courses/${edit.id}`, dataCurso)
            .then((res) => {
                console.log(res);
                getCursos()
                setVisibleEdit(false)
                toast.current.show({severity:'success', summary: 'Curso actualizado', detail:`Se actualizo el curso ${dataCurso.name} `, life: 3000});
            })
        })
    }

        //ELMINAR CURSO
        


    return (

    //TABLA
        <div className="grid">
            <Toast ref={toast} />
            <Toast ref={toastBC} position="center" />

            <Dialog header="Añadir Curso" visible={visibleAdd} style={{ width: '80vw', maxWidth: '500px' }} onHide={() => setVisibleAdd(false)} footer={footerAdd}>
                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="name1">Nombre</label>
                        <InputText ref={nombreAdd} type="text" className="p-inputtext-lg"/>
                    </div>
                </div>
            </Dialog>

            <Dialog header="Editar Curso" visible={visibleEdit} style={{ width: '80vw', maxWidth: '500px' }} onHide={() => setVisibleEdit(false)} footer={footerEdit}>
                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="name1">Nombre</label>
                        <InputText value={edit.name} onChange={(e) => {
                            setEdit({
                                ...edit,
                                name: e.target.value
                            })
                        }} type="text" className="p-inputtext-lg"/>
                    </div>
                </div>
            </Dialog>

            <div className="col-12">
                <div className="card">
                    <Button label="Añadir Curso" icon="pi pi-plus" onClick={() => setVisibleAdd(true)} />
                    <h5>Cursos</h5>
                    <DataTable value={cursos} rows={10} paginator rowsPerPageOptions={[5, 10, 25, 50]} removableSort responsiveLayout="scroll">
                        {/* <Column header="Image" body={(data) => <img className="shadow-2" src={`/demo/images/product/${data.image}`} alt={data.image} width="50" />} /> */}
                        <Column field="id" header="Id" sortable style={{ width: '35%' }} />
                        <Column field="name" header="Nombre" sortable style={{ width: '35%' }} />
                        <Column header="Acciones" body={actionBodyTemplate} style={{ width: '35%' }} />
                    </DataTable>
                </div>
            </div>
        </div>

    );
};

export default Cursos;
