import { useEffect, useState, useRef } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from "recharts";
import { Box, Typography, Button, Stack } from "@mui/material";
import { apiUrl } from "../config";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

/**
 * @typedef {Object} ReservaData
 * @property {number} id - ID de la reserva
 * @property {string} cliente - Nombre del cliente
 * @property {number} precio - Precio de la reserva
 * @property {number} habitacion - Número de habitación
 */

/**
 * @typedef {Object} CustomStyles
 * @property {Object} page - Estilos para la página PDF
 * @property {Object} title - Estilos para el título
 * @property {Object} chart - Estilos para el gráfico
 * @property {Object} dataRow - Estilos para las filas de datos
 * @property {Object} dataCell - Estilos para las celdas de datos
 */

/**
 * Estilos para react-pdf
 * @type {CustomStyles}
 */
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  chart: {
    marginVertical: 10,
    padding: 10
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    padding: 5
  },
  dataCell: {
    flex: 1,
    padding: 5
  }
});

/**
 * @component GraficoPDF
 * @description Componente que genera un PDF con los datos de las reservas
 * @param {Object} props - Propiedades del componente
 * @param {ReservaData[]} props.data - Datos de las reservas
 * @returns {JSX.Element} Documento PDF
 */
const GraficoPDF = ({data}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Gráfico de Reservas</Text>
      <View style={styles.chart}>
        {data.map((item) => (
          <View style={styles.dataRow} key={item.id}>
            <Text style={styles.dataCell}>{item.cliente}</Text>
            <Text style={styles.dataCell}>{item.precio}€</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

/**
 * @component GraficoReservas
 * @description Componente principal que muestra un gráfico de barras con las reservas
 * y proporciona opciones para exportar/imprimir los datos
 * @returns {JSX.Element} Componente de gráfico de reservas
 */
function GraficoReservas() {
  /** @type {[ReservaData[], function]} Estado para los datos de reservas */
  const [data, setData] = useState([]);
  /** @type {React.RefObject} Referencia al elemento del gráfico */
  const chartRef = useRef(null);

  // Efecto para cargar los datos de las reservas
  useEffect(() => {
    /**
     * Obtiene los datos de las reservas del servidor
     * @async
     */
    async function getReservas() {
      try {
        const response = await fetch(apiUrl + "/reservas");
        if (response.ok) {
          const data = await response.json();
          
          const processedData = data.datos.map(reserva => ({
            id: reserva.reservation_id,
            cliente: reserva.client_id_cliente.client_name,
            precio: reserva.price,
            habitacion: reserva.room_number
          }));
          
          setData(processedData);
        }
      } catch (error) {
        console.error("Error al obtener las reservas:", error);
      }
    }
    getReservas();
  }, []);

  /**
   * Maneja la impresión directa desde el navegador
   */
  const handlePrint = () => {
    window.print();
  };

  /**
   * Exporta el gráfico a PDF usando html2canvas
   * @async
   */
  const exportToPDFFromImage = async () => {
    try {
      const element = chartRef.current;
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('landscape');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('grafico-reservas-imagen.pdf');
    } catch (error) {
      console.error("Error al exportar a PDF:", error);
    }
  };

  /**
   * @component CustomTooltip
   * @description Tooltip personalizado para el gráfico
   * @param {Object} props - Propiedades del tooltip
   * @returns {JSX.Element|null} Tooltip personalizado o null
   */
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ 
          backgroundColor: 'white', 
          padding: 2, 
          border: '1px solid #ccc',
          borderRadius: 1
        }}>
          <Typography variant="subtitle2">{`Cliente: ${label}`}</Typography>
          <Typography variant="body2" color="primary">
            {`Precio: ${payload[0].value}€`}
          </Typography>
          <Typography variant="body2" color="secondary">
            {`Habitación: ${payload[0].payload.habitacion}`}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // JSX del componente
  return (
    <Box sx={{ backgroundColor: "#5fe1e7", minHeight: "100vh", padding: 3 }}>
      <Typography 
        variant="h4" 
        align="center" 
        sx={{ 
          mt: 2, 
          mb: 4,
          fontWeight: 'bold',
          color: '#2c3e50'
        }}
      >
        Análisis de Reservas por Cliente
      </Typography>

      {/* Botones de exportación */}
      <Stack 
        direction="row" 
        spacing={2} 
        justifyContent="center" 
        sx={{ mb: 3 }}
      >
        <Button 
          variant="contained" 
          onClick={handlePrint}
        >
          Imprimir (Navegador)
        </Button>
        
        <Button 
          variant="contained" 
          onClick={exportToPDFFromImage}
        >
          Exportar a PDF (Imagen)
        </Button>

        <PDFDownloadLink 
          document={<GraficoPDF data={data} />} 
          fileName="grafico-reservas-diseñado.pdf"
        >
          {({ loading }) => (
            <Button 
              variant="contained" 
              disabled={loading}
            >
              {loading ? 'Generando PDF...' : 'Exportar a PDF (Diseñado)'}
            </Button>
          )}
        </PDFDownloadLink>
      </Stack>

      {/* Contenedor del gráfico */}
      <Box 
        ref={chartRef} 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          backgroundColor: "#a2dff7",
          padding: 3,
          borderRadius: 2,
          margin: 2,
          height: 500
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#95a5a6" />
            <XAxis 
              dataKey="cliente" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              tick={{ fill: '#2c3e50' }}
            />
            <YAxis 
              tick={{ fill: '#2c3e50' }}
              label={{ 
                value: 'Precio (€)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ 
                paddingTop: "20px",
                fontFamily: "Arial"
              }}
            />
            <Bar 
              dataKey="precio" 
              fill="#3498db" 
              name="Precio de Reserva"
              radius={[5, 5, 0, 0]}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

export default GraficoReservas;