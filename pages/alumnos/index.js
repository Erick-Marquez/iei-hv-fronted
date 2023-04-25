import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ProductService } from '../../demo/service/ProductService';
import { LayoutContext } from '../../layout/context/layoutcontext';
import Link from 'next/link';


import { Button } from 'primereact/button';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import BaseUrl from '../../fetch/BaseUrl';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';


//AXIOS//---------
axios.defaults.withCredentials = true

const Alumnos = () => {
    const [ alumnos, setAlumnos ] = useState([])
    const [ edit, setEdit ] = useState([])

    const alumnoAdd = useRef('')
    const nombreEdit = useRef('')
    const toast = useRef(null); //para las notificaciones

    useEffect(() => {
        getAlumnos()
    }, [])

    //AÑADIR ALUMNO

    const [visibleAdd, setVisibleAdd] = useState(false);
    const footerAdd = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" onClick={() => setVisibleAdd(false)} className="p-button-danger" />
            <Button label="Guardar" icon="pi pi-check" onClick={() => guardarAlumno()} autoFocus style={{backgroundColor: "#2B3467"}}/>
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
                <Button icon="pi pi-trash" severity="danger" rounded onClick={() => console.log(rowData)} />
            </>
        );
    };

    //ELIMINAR CURSO

    const eliminar = () => {
        toast.current.show({ severity: 'warn', summary: 'Eliminar', detail: 'You have rejected', life: 3000 });
        
    }

    
    const confirm2 = () => {
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            // accept,
            eliminar
        });
    };

    //GET CURSO - AXIOS
    function getAlumnos() {
        BaseUrl.get("api/v1/courses") //Ocultando el axios para mayor accesibilidad -> BaseUrl.js
        .then((res) => {
            console.log(res);
            setAlumnos(res.data.data)
        })
        
    }

    //VALIDAR FORMULARIO

        //GUARDAR CURSO
    function guardarAlumno() {
        console.log(alumnoAdd.current.value)
        const dataAlumno = {
            name: alumnoAdd.current.value,
            grado: alumnoAdd.current.value,
            seccion: alumnoAdd.current.value
        }
        BaseUrl.get("sanctum/csrf-cookie")
        .then(() => {

            BaseUrl.post("api/v1/courses", dataAlumno)
            .then((res) => {
                console.log(res);
                getAlumnos()
                setVisibleAdd(false)
                toast.current.show({severity:'success', summary: 'Alumno añadido', detail:`Se añadio al alumno ${dataAlumno.name} al grado y seccion ${dataAlumno.grado} y ${dataAlumno.seccion} `, life: 3000});
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

            <Dialog header="Añadir Alumnos" visible={visibleAdd} style={{ width: '80vw', maxWidth: '500px' }} onHide={() => setVisibleAdd(false)} footer={footerAdd}>
                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="name1">Nombre</label>
                        <InputText ref={alumnoAdd.grado} type="text" className="p-inputtext-lg"/>
                        <label htmlFor="name1">Grado</label>
                        <InputText ref={alumnoAdd} type="text" className="p-inputtext-lg"/>
                        <label htmlFor="name1">Seccion</label>
                        <InputText ref={alumnoAdd} type="text" className="p-inputtext-lg"/>
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
                    <Button label="Añadir Alumnos" icon="pi pi-plus" onClick={() => setVisibleAdd(true)} />
                    <h5>Alumnos</h5>
                    <DataTable value={alumnos} rows={10} paginator rowsPerPageOptions={[5, 10, 25, 50]} removableSort responsiveLayout="scroll">
                        {/* <Column header="Image" body={(data) => <img className="shadow-2" src={`/demo/images/product/${data.image}`} alt={data.image} width="50" />} /> */}
                        <Column field="nombre" header="Nombre" sortable style={{ width: '30%' }} />
                        <Column field="grado" header="Grado" sortable style={{ width: '30%' }} />
                        <Column field="seccion" header="Seccion" sortable style={{ width: '30%' }} />
                        <Column header="Acciones" body={actionBodyTemplate} style={{ width: '30%' }} />
                    </DataTable>
                </div>
            </div>
        </div>

    );
};

export default Alumnos;
