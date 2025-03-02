import Menu from "../components/Menu";
import { Box, Button, Typography } from "@mui/material";
import img from "../assets/images/img404.png";

function PaginaError() {
  return (
    <>
      <Menu />
      <Typography variant="h4" align="center" sx={{ mt: 2 }}>
        No hemos encontrado la página que buscas
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <img src={img} alt="Error 404" style={{ maxWidth: '30%', height: 'auto' }} />
      </Box>
      <Box textAlign={"center"} sx={{ mt: 2 }}>
        <Button variant="contained" align="center" href="/" sx={{ mt: 2 }}>
          Ir a la página princial
        </Button>
      </Box>
    </>
  );
}
export default PaginaError;
