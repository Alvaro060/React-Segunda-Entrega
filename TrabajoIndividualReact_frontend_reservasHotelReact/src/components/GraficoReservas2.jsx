import { useEffect, useState, useRef } from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip,
  Legend 
} from "recharts";
import { Box, Typography, Button, Stack } from "@mui/material";
import { apiUrl } from "../config";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

/**
 * @component GraficoPastel
 * @description Componente que muestra un gráfico circular de las reservas por cliente
 * @returns {JSX.Element} Gráfico circular de reservas
 */
function GraficoPastel() {
  /** @type {[Array, function]} Estado para los datos procesados */
  const [dataPie, setDataPie] = useState([]);
  /** @type {React.RefObject} Referencia al elemento del gráfico */
  const chartRef = useRef(null);
  
  /** @type {Array} Colores para las secciones del gráfico */
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  /**
   * Estilos para react-pdf
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
   */
  const GraficoPDF = ({data}) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Distribución de Reservas por Cliente</Text>
        <View>
          {data.map((item) => (
            <View style={styles.dataRow} key={item.name}>
              <Text style={styles.dataCell}>{item.name}</Text>
              <Text style={styles.dataCell}>{item.value}€</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  useEffect(() => {
    /**
     * Obtiene y procesa los datos de reservas para el gráfico
     * @async
     */
    async function getReservasData() {
      try {
        const response = await fetch(apiUrl + "/reservas");
        if (response.ok) {
          const data = await response.json();
          
          // Procesar datos para agrupar por cliente y sumar precios
          const reservasPorCliente = data.datos.reduce((acc, reserva) => {
            const clientName = reserva.client_id_cliente.client_name;
            if (!acc[clientName]) {
              acc[clientName] = {
                name: clientName,
                value: 0
              };
            }
            acc[clientName].value += reserva.price;
            return acc;
          }, {});

          // Convertir a array para el gráfico
          setDataPie(Object.values(reservasPorCliente));
        }
      } catch (error) {
        console.error("Error al obtener datos para el gráfico:", error);
      }
    }
    getReservasData();
  }, []);

  /**
   * Maneja la impresión directa desde el navegador
   */
  const handlePrint = () => {
    window.print();
  };

  /**
   * Exporta el gráfico a PDF usando html2canvas
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
      pdf.save('grafico-circular-reservas.pdf');
    } catch (error) {
      console.error("Error al exportar a PDF:", error);
    }
  };

  /**
   * @component CustomTooltip
   * @description Tooltip personalizado para el gráfico
   */
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ 
          backgroundColor: 'white', 
          padding: 2, 
          border: '1px solid #ccc',
          borderRadius: 1
        }}>
          <Typography variant="subtitle2">
            {`Cliente: ${payload[0].name}`}
          </Typography>
          <Typography variant="body2" color="primary">
            {`Total en reservas: ${payload[0].value}€`}
          </Typography>
        </Box>
      );
    }
    return null;
  };

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
        Distribución de Reservas por Cliente
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
          document={<GraficoPDF data={dataPie} />} 
          fileName="grafico-circular-reservas.pdf"
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

      <Box 
        ref={chartRef}
        sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          backgroundColor: "#a2dff7",
          padding: 3,
          borderRadius: 2,
          margin: 2,
          height: 600 // Aumentado para más espacio
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataPie}
              cx="50%"
              cy="45%" // Ajustado para dar más espacio abajo
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={180} // Ajustado para mantener proporciones
              fill="#8884d8"
              dataKey="value"
            >
              {dataPie.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{
                paddingTop: "40px", // Más espacio arriba de la leyenda
                paddingBottom: "20px", // Más espacio abajo de la leyenda
                fontFamily: "Arial"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

export default GraficoPastel;