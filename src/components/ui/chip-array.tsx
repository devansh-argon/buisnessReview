import { Chip, Paper, Box } from "@mui/material";

export default function ChipsArray(props: { chipdata: string[] }) {
    return (
        <Paper
            elevation={0}
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
            }}
            component="ul"
        >
            {props.chipdata.map((data, index) => (
                <Box
                    key={index}
                    component="li"
                    sx={{ listStyle: 'none' }}>
                    <Chip
                        variant="filled"
                        size="small"
                        label={data}
                        sx={{ border: '1px solid black' }}
                    />
                </Box>
            ))}
        </Paper>
    );
}
