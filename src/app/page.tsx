'use client'


import CloudIcon from "@mui/icons-material/Cloud";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import ImageIcon from "@mui/icons-material/Image";
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { ArrowForwardIos } from '@mui/icons-material'
import React from "react";
import { useRouter } from "next/navigation";

// Mock data for the feature cards
const featureCards = [
    {
        icon: CloudIcon,
        title: "Step 1",
        description: "Click on Get Stated to visit admin page. ",
    },
    {
        icon: ImageIcon,
        title: "Step 2",
        description: "Update/Create Organitions details to generate ai based suggetions",
    },
    {
        icon: CloudQueueIcon,
        title: "Step 3",
        description: "Click on Open to see suggetions and re-generate",
    },
];

const Element = () => {

    const router = useRouter()

    return (
        <Box
            sx={{
                bgcolor: "white",
                display: "flex",
                justifyContent: "center",
                width: "100%",
            }}
        >
            <Container maxWidth="lg" sx={{ position: "relative", height: "1024px" }}>
                {/* Hero Section */}
                <Grid container spacing={4} sx={{ mt: 9 }}>
                    <Grid size={{ md: 7, xs: 12 }}>
                        <Stack spacing={4}>
                            <Typography
                                variant="h1"
                                sx={{
                                    fontFamily: "'Avenir-Heavy', Helvetica",
                                    color: "#252525",
                                    fontSize: "4.5rem",
                                    lineHeight: "88px",
                                    fontWeight: "normal",
                                }}
                            >
                                Generate AI Based
                                <br />
                                Review Sugesstions
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    fontFamily: "'Avenir-Roman', Helvetica",
                                    color: "#252525cc",
                                    fontSize: "26px",
                                    maxWidth: "586px",
                                    fontWeight: "normal",
                                }}
                            >
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                Faucibus in libero risus semper habitant arcu eget. Et integer
                                facilisi eget diam.
                            </Typography>

                            <Box>
                                <Button
                                    variant="contained"
                                    onClick={() => { router.push("./admin") }}
                                    sx={{
                                        bgcolor: "#252525",
                                        borderRadius: "36px",
                                        px: 6,
                                        py: 3,
                                        fontSize: "1.5rem",
                                        textTransform: "none",
                                        fontFamily: "'Poppins-Regular', Helvetica",
                                        lineHeight: "18px",
                                        "&:hover": {
                                            bgcolor: "#3a3a3a",
                                        },
                                    }}
                                    endIcon={<ArrowForwardIos />}
                                >
                                    Get Started
                                </Button>
                            </Box>
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box
                            sx={{
                                position: "relative",
                                width: "100%",
                                height: { xs: 400, sm: 400, md: 480 }, // Responsive container height
                            }}
                        >

                            <Box
                                component="img"
                                src="./Rectangle 6.svg"
                                alt="Rectangle 6"
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: { xs: "70%", sm: "65%", md: "70%" },
                                    zIndex: 1,
                                }}
                            />

                            <Box
                                component="img"
                                src="./Rectangle 7.svg"
                                alt="Rectangle 7"
                                sx={{
                                    position: "absolute",
                                    bottom: 0,
                                    right: 0,
                                    width: { xs: "70%", sm: "65%", md: "70%" },
                                    zIndex: 2,
                                }}
                            />
                        </Box>
                    </Grid>


                </Grid>

                {/* Feature Cards Section */}
                <Box
                    sx={{
                        bgcolor: "#252525",
                        borderRadius: "40px",
                        p: 8,
                        mt: 8,
                        position: { xs: "relative", md: "absolute" },
                        bottom: { xs: "auto", md: 64 },
                        left: { xs: "auto", md: 64 },
                        right: { xs: "auto", md: 64 },
                    }}
                >
                    <Grid container spacing={8}>
                        {featureCards.map((card, index) => (
                            <Grid size={{ xs: 12, md: 4 }} key={index}>
                                <Stack spacing={3}>
                                    <Stack spacing={1.5}>
                                        <Box sx={{ color: "white" }}>{<card.icon />}</Box>
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontFamily: "'Avenir-Heavy', Helvetica",
                                                color: "#ffffffcc",
                                                fontSize: "32px",
                                                fontWeight: "normal",
                                            }}
                                        >
                                            {card.title}
                                        </Typography>
                                    </Stack>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontFamily: "'Avenir-Book', Helvetica",
                                            color: "white",
                                            fontSize: "1.5rem",
                                            fontWeight: "normal",
                                        }}
                                    >
                                        {card.description}
                                    </Typography>
                                </Stack>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default Element;
