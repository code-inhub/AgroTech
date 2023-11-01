import React from 'react'
import {useState, useEffect} from 'react';
import axios from 'axios';
import {
    AppBar,
    Toolbar,
    Typography,
    Avatar,
    Container,
    Grid,
    CircularProgress,
    Card,   
    CardActionArea,
    CardMedia,
    CardContent,
    Table,
    TableContainer,
    TableRow,
    TableHead,
    TableCell,
    Paper,
    TableBody,
    Button,
    styled,
} from '@mui/material';
import { common } from '@mui/material/colors';
import ClearIcon from '@mui/icons-material/Clear';
import logo from './logo.jpg';
import CustomDropzone from './CustomDropzone';
import bg from './bg.png';

const ColorButton = styled(Button)(({theme}) => ({
    color: theme.palette.getContrastText(common.white),
    backgroundColor:common.white,
    '&:hover': {
        backgroundColor: '#ffffff7a'
    }
}));




function Display() {

    const [selectedFile, setSelectedFile] = useState();
    const [preview, setPreview] = useState();
    const [data, setData] = useState();
    const [image, setImage] = useState(false);
    const [isLoading, setIsloading] = useState(false);
    let confidence = 0;


    const sendFile = async () => {
        if (image) {
            let formData = new FormData();
            formData.append("file", selectedFile);
            let res = await axios({method: "post", url: process.env.REACT_APP_API_URL, data: formData});
            if (res.status === 200) {
                setData(res.data);
            }
            setIsloading(false);
        }
    }

    const clearData = () => {
        setData(null);
        setImage(false);
        setSelectedFile(null);
        setPreview(null);
    };

    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined);
            return;
        }
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
    }, [selectedFile]);

    useEffect(() => {
        if (!preview) {
            return;
        }
        setIsloading(true);
        sendFile();
    }, [preview]);

    const onSelectFile = (files) => {
        if (!files || files.length === 0) {
            setSelectedFile(undefined);
            setImage(false);
            setData(undefined);
            return;
        }
        setSelectedFile(files[0]);
        setData(undefined);
        setImage(true);
    };

    if (data) {
        confidence = (parseFloat(data.confidence) * 100).toFixed(2);
    }


    return (
        <>
            <AppBar position="static"
                 sx={{ backgroundColor: '#be6a77',
                 boxShadow: 'none',
                 color:"white"
                }}
            >
                <Toolbar>
                    <Avatar src={logo}></Avatar>
                        <Typography 
                           sx={{
                            marginLeft: "10px",
                           }}
                            variant="h6"
                            noWrap
                        >
                            AgroTech: Potato Disease Classification
                        </Typography>
                    
                </Toolbar>
            </AppBar>

            <Container maxWidth={false}
                sx={{ backgroundImage: `url(${bg})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                height: "91vh",
                marginTop: "15px"}}
                disableGutters={true}
                >

                <Grid 
                sx={{justifyContent: "center",
                padding: "3em 1em 0 1em"}}
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}>
                    <Grid item
                        xs={12}>
                        <Card sx={{
                              margin: "auto",
                              maxWidth: 400,
                              height: 500,
                              backgroundColor: 'transparent',
                              boxShadow: '0px 9px 70px 0px rgba(0, 0, 0, 0.3) !important',
                              borderRadius: '15px',
                              ...(image ? { height: 'auto' } : {}),
                            }}
                         >
                            {
                            image && <CardActionArea>
                                <CardMedia 
                                    sx={{
                                        height: 400,
                                    }}
                                    image={preview}
                                    component="image"
                                    title="Contemplative Reptile"/>
                            </CardActionArea>
                        }
                            {
                            !image && <CardContent 
                            >

                                        <CustomDropzone
                                                acceptedFiles={['image/*']}
                                                dropzoneText="Drag and drop an image of a potato plant leaf to process"
                                                onSelectFile={onSelectFile}
                                              />
                                     </CardContent>
                            }
                            {
                            data && <CardContent sx={ {
                              backgroundColor: 'white',
                              display: 'flex',
                              justifyContent: 'center',
                              flexDirection: 'column',
                              alignItems: 'center'
                          }}
                            >
                                <TableContainer component={Paper}
                                    sx={{
                                        backgroundColor: 'transparent !important',
                                        boxShadow: 'none !important'
                                    }}
                                >
                                    <Table 
                                     sx={{
                                        backgroundColor: 'transparent !important'
                                     }}
                                        size="small"
                                        aria-label="simple table"
                                    >
                                        <TableHead 
                                          sx={{
                                            backgroundColor: 'transparent !important'
                                        }}
                                        >
                                            <TableRow  sx={{
                                                       backgroundColor: 'transparent !important'
                                                  }}
                                            >
                                                <TableCell  sx={{
                                                      fontSize: '14px',
                                                      backgroundColor: 'transparent !important',
                                                      borderColor: 'transparent !important',
                                                      color: '#000000a6 !important',
                                                      fontWeight: 'bolder',
                                                      padding: '1px 24px 1px 16px'
                                                  }}
                                                >Label:</TableCell>
                                                <TableCell align="right"
                                                    sx={{
                                                      fontSize: '14px',
                                                      backgroundColor: 'transparent !important',
                                                      borderColor: 'transparent !important',
                                                      color: '#000000a6 !important',
                                                      fontWeight: 'bolder',
                                                      padding: '1px 24px 1px 16px'
                                                  }}
                                                >Confidence:</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody 
                                          sx={{
                                            backgroundColor: 'transparent !important'
                                        }}
                                        >
                                            <TableRow 
                                            sx={{
                                              tableRow: {
                                                backgroundColor: 'transparent !important'
                                            },
                                            }}
                                            >
                                                <TableCell component="th" scope="row"
                                                  sx={{
                                                    fontSize: '14px',
                                                    backgroundColor: 'transparent !important',
                                                    borderColor: 'transparent !important',
                                                    color: '#000000a6 !important',
                                                    fontWeight: 'bolder',
                                                    padding: '1px 24px 1px 16px'
                                                }}
                                                >
                                                    {
                                                    data.class
                                                } </TableCell>
                                                <TableCell align="right"
                                                    sx={{
                                                      fontSize: '14px',
                                                      backgroundColor: 'transparent !important',
                                                      borderColor: 'transparent !important',
                                                      color: '#000000a6 !important',
                                                      fontWeight: 'bolder',
                                                      padding: '1px 24px 1px 16px'
                                                  }}
                                                >
                                                    {confidence}%</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        }
                            {
                            isLoading && <CardContent 
                            sx={{
                              backgroundColor: 'white',
                              display: 'flex',
                              justifyContent: 'center',
                              flexDirection: 'column',
                              alignItems: 'center'
                          }}
                            >
                                <CircularProgress color="secondary"
                                  sx={{
                                    color: '#be6a77 !important'
                                }}
                                />
                                <Typography // className={
                                    //         classes.title
                                    //     }
                                    variant="h6"
                                    noWrap
                                >
                                    Processing
                                </Typography>
                            </CardContent>
                        } </Card>
                    </Grid>
                    {
                    data && <Grid item
                        sx={
                          {
                            maxWidth: "416px",
                            width: "100%"
                        }
                        }
                    >

                        <ColorButton variant="contained"
                            sx={
                              {
                                width: "-webkit-fill-available",
                                borderRadius: "15px",
                                padding: "15px 22px",
                                color: "#000000a6",
                                fontSize: "20px",
                                fontWeight: 900
                            }
                            }
                            color="primary"
                            component="span"
                            size="large"
                            onClick={clearData}
                            startIcon={
                                <ClearIcon
                            />
                        } >
                            Clear
                        </ColorButton>
                    </Grid>
                } </Grid>
            </Container>

        </>
    )
}

export default Display
