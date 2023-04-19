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


    //AXIOS//---------


axios.defaults.withcredentials = true
const Cursos = () => {
    const [ cursos, setCursos ] = useState([])
    const nombre = useRef('')

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/v1/courses")
        .then((res) => {
            console.log(res);
            setCursos(res.data.data)
        })
    }, [])

    const [visible, setVisible] = useState(false);
    const footerContent = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-danger" />
            <Button label="Guardar" icon="pi pi-check" onClick={() => guardarCurso()} autoFocus style={{backgroundColor: "#2B3467"}}/>
        </div>
    );
//VALIDAR DORMULARIO

    function guardarCurso() {
        console.log(nombre.current.value)
        const dataCurso = {
            name: nombre.current.value
        }
        axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie")
        .then(() => {
            axios.post("http://127.0.0.1:8000/api/v1/courses", dataCurso)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })

        })
    }

    return (
        <div className="grid">
            {cursos.length}
            <Button label="Añadir Curso" icon="pi pi-plus" onClick={() => setVisible(true)} />
            <Dialog header="Añadir Curso" visible={visible} style={{ width: '80vw', maxWidth: '500px' }} onHide={() => setVisible(false)} footer={footerContent}>
            <div className="p-fluid">
                <div className="field">
                    <label htmlFor="name1">Nombre</label>
                    <InputText ref={nombre} id="name1" type="text" className="p-inputtext-lg"/>
                </div>
            </div>
            </Dialog>

            <div className="col-12">
                <div className="card">
                    <h5>Cursos</h5>
                    <DataTable value={cursos} rows={5} paginator responsiveLayout="scroll">
                        {/* <Column header="Image" body={(data) => <img className="shadow-2" src={`/demo/images/product/${data.image}`} alt={data.image} width="50" />} /> */}
                        <Column field="id" header="Id" sortable style={{ width: '35%' }} />
                        <Column field="name" header="Nombre" sortable style={{ width: '35%' }} />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default Cursos;
