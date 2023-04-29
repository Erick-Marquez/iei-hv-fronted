import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

import React, { useContext, useEffect, useRef, useState } from 'react';

import { Button } from 'primereact/button';

import { Toast } from 'primereact/toast';
import BaseUrl from '../../fetch/BaseUrl';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import SectionTable from '../../components/grados/SectionTable';


const Grade = () => {
    const [ grades, setGrades ] = useState([])

    const [ visibleModalSection, setVisibleModalSection ] = useState(false)
    const [ sections, setSections ] = useState([])

    console.log('render')

    const toast = useRef(null)

    useEffect(() => {
        getGrades()
    }, [])

    function openModalSection(id) {
        setVisibleModalSection(true)

        const sectionsFilter = grades.find(grade => grade.id === id)
        setSections(sectionsFilter)
    }
    
    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button 
                    icon="pi pi-book" 
                    severity="warning"
                    tooltip="Cursos"
                    rounded 
                    className="mr-4" 
                    onClick={() => {
                        
                    }} 
                />
                <Button 
                    icon="pi pi-list" 
                    severity="success" 
                    tooltip="Secciones"
                    rounded 
                    className="mr-4" 
                    onClick={() => {
                        openModalSection(rowData.id)
                    }} 
                />
            </>
        );
    };


    //GET GRADOS - AXIOS
    function getGrades() {
        BaseUrl.get("api/v1/grades?filter[educational_level]=Secundaria&included=sections")
        .then((res) => {
            console.log(res);
            setGrades(res.data.data)
        })
    }
      
    return (
        <div className="grid">
            <Toast ref={toast} />

            <SectionTable sections={sections} visible={visibleModalSection} setVisible={setVisibleModalSection}/>

            <div className="col-12">
                <div className="card">
                    <h5>Grados</h5>
                    <DataTable value={grades} rows={10} paginator rowsPerPageOptions={[5, 10, 25, 50]} removableSort responsiveLayout="scroll">
                        <Column field="symbol" header="Grado" sortable style={{ width: '22%' }} body={(e) => {return (<>{e.symbol} - {e.description}</>)}}/>
                        <Column field="educational_level" header="Nivel" sortable style={{ width: '22%' }} />
                        <Column header="Secciones" sortable style={{ width: '22%' }} body={(e) => {return (<>{e.sections.length}</>)}}/>
                        <Column header="N° Alumnos" sortable style={{ width: '22%' }} />
                        <Column header="Acciones" body={actionBodyTemplate} style={{ width: '22%' }} />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default Grade;
