package utez.edu.mx.Zaziderma.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "ventas")
public class Venta {

    @Id
    private String id;
    private String idCliente; // Referencia al cliente
    private String idTrabajador; // Referencia al trabajador que realizó la venta
    private Map<String, Integer> productos; // Map que almacena idProducto -> cantidad
    private BigDecimal subTotal;
    private BigDecimal total;
    private boolean estado;
    private LocalDateTime fechaDeVenta;
    private boolean aplicarIVA;
    private String tipoDePago;
    private String tipoDeEntrega;
    private String urlImagenEnvio; // nueva propiedad
    private boolean enviado; // nuevo estado de envío


    // Constructor vacío
    public Venta() {
    }

    public Venta(String id, String idCliente, String idTrabajador, Map<String, Integer> productos, BigDecimal subTotal, BigDecimal total, boolean estado, LocalDateTime fechaDeVenta, boolean aplicarIVA, String tipoDePago, String tipoDeEntrega, String urlImagenEnvio, boolean enviado) {
        this.id = id;
        this.idCliente = idCliente;
        this.idTrabajador = idTrabajador;
        this.productos = productos;
        this.subTotal = subTotal;
        this.total = total;
        this.estado = estado;
        this.fechaDeVenta = fechaDeVenta;
        this.aplicarIVA = aplicarIVA;
        this.tipoDePago = tipoDePago;
        this.tipoDeEntrega = tipoDeEntrega;
        this.urlImagenEnvio = urlImagenEnvio;
        this.enviado = enviado;
    }

    public String getUrlImagenEnvio() {
        return urlImagenEnvio;
    }

    public void setUrlImagenEnvio(String urlImagenEnvio) {
        this.urlImagenEnvio = urlImagenEnvio;
    }

    public boolean isEnviado() {
        return enviado;
    }

    public void setEnviado(boolean enviado) {
        this.enviado = enviado;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(String idCliente) {
        this.idCliente = idCliente;
    }

    public String getIdTrabajador() {
        return idTrabajador;
    }

    public void setIdTrabajador(String idTrabajador) {
        this.idTrabajador = idTrabajador;
    }

    public Map<String, Integer> getProductos() {
        return productos;
    }

    public void setProductos(Map<String, Integer> productos) {
        this.productos = productos;
    }

    public BigDecimal getSubTotal() {
        return subTotal;
    }

    public void setSubTotal(BigDecimal subTotal) {
        this.subTotal = subTotal;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public boolean isEstado() {
        return estado;
    }

    public void setEstado(boolean estado) {
        this.estado = estado;
    }

    public LocalDateTime getFechaDeVenta() {
        return fechaDeVenta;
    }

    public void setFechaDeVenta(LocalDateTime fechaDeVenta) {
        this.fechaDeVenta = fechaDeVenta;
    }

    public boolean isAplicarIVA() {
        return aplicarIVA;
    }

    public void setAplicarIVA(boolean aplicarIVA) {
        this.aplicarIVA = aplicarIVA;
    }

    public String getTipoDePago() {
        return tipoDePago;
    }

    public void setTipoDePago(String tipoDePago) {
        this.tipoDePago = tipoDePago;
    }

    public String getTipoDeEntrega() {
        return tipoDeEntrega;
    }

    public void setTipoDeEntrega(String tipoDeEntrega) {
        this.tipoDeEntrega = tipoDeEntrega;
    }
}
