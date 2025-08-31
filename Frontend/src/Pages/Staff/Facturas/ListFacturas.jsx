import React, { useEffect, useState } from "react";

const ListFacturas = () => {
    const [facturasPagadas, setFacturasPagadas] = useState([]);
    const [facturasACobrar, setFacturasACobrar] = useState([]);

    useEffect(() => {
    const token = localStorage.getItem("access");

    fetch("http://127.0.0.1:8000/conseguir_facturas/", {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => {
        if (!res.ok) throw new Error("Error al obtener facturas");
        return res.json();
        })
        .then((data) => {
        setFacturasPagadas(data.facturas_pagadas || []);
        setFacturasACobrar(data.facturas_a_cobrar || []);
        })
        .catch((err) => {
        console.error(err);
        setFacturasPagadas([]);
        setFacturasACobrar([]);
        });
    }, []);


  return (
    <div className="container mt-4">
    <div className="d-flex align-items-center mb-3 fw-bold gap-2" style={{ color: "#0d6efd", fontSize: "25px" }}>
        <i className="bx bx-receipt" style={{ fontSize: "2rem", color: "#0d6efd" }}></i>
        Lista De Facturas
    </div>

    {/* Facturas Pagadas */}
    <h4 className="text-success fw-bold mt-5">Facturas Pagadas</h4>
    <div className="table-responsive mb-5">
        {facturasPagadas.length > 0 ? (
        <table className="table table-striped table-bordered align-middle text-center">
            <thead className="table-success text-center">
            <tr>
                <th>ID</th>
                <th>Pago</th>
                <th>Fecha</th>
                <th>Razón Social</th>
                <th>CUIL</th>
                <th>Provincia</th>
                <th>Ciudad</th>
                <th>Calle</th>
                <th>Número</th>
                <th>Piso</th>
                <th>Dpto</th>
            </tr>
            </thead>
            <tbody>
            {facturasPagadas.map((factura) => (
                <tr key={factura.id}>
                <td>{factura.id}</td>
                <td>{factura.pago}</td>
                <td>
                    {new Date(factura.fecha_factura).toLocaleDateString('es-AR')} {' '}
                    {new Date(factura.fecha_factura).toLocaleTimeString('es-AR', {hour: '2-digit', minute:'2-digit'})}
                </td>
                <td>{factura.razon_social}</td>
                <td>{factura.cuil}</td>
                <td>{factura.provincia}</td>
                <td>{factura.ciudad}</td>
                <td>{factura.calle}</td>
                <td>{factura.numero_calle}</td>
                <td>{factura.piso || "—"}</td>
                <td>{factura.departamento || "—"}</td>
                </tr>
            ))}
            </tbody>
        </table>
        ) : (
        <p className="text-center text-muted fw-bold">No hay facturas pagadas.</p>
        )}
    </div>

    {/* Facturas a Cobrar */}
    <h4 className="text-danger fw-bold">Facturas a Cobrar</h4>
    <div className="table-responsive">
        {facturasACobrar.length > 0 ? (
        <table className="table table-striped table-bordered align-middle text-center">
            <thead className="table-danger text-center">
            <tr>
                <th>ID Paquete</th>
                <th>Cliente</th>
                <th>Total</th>
            </tr>
            </thead>
            <tbody>
            {facturasACobrar.map((factura) => (
                <tr key={factura.id}>
                <td>{factura.id}</td>
                <td>{factura.cliente}</td>
                <td>${parseFloat(factura.total).toLocaleString()}</td>
                </tr>
            ))}
            </tbody>
        </table>
        ) : (
        <p className="text-center text-muted fw-bold">No hay facturas a cobrar.</p>
        )}
    </div>
    </div>

  );
};

export default ListFacturas;
