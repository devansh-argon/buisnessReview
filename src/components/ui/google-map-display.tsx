import { Link, Typography, Stack } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';

export function GoogleMapsDisplay({ url }: { url: string }) {
    return (
        <Stack direction="row" alignItems="center" spacing={1}>
            <LocationOnIcon color="info" />
            <Typography>
                <strong>Google Maps: </strong>
                <Link href={url} target="_blank" rel="noopener" underline="hover">
                    Open Location
                </Link>
            </Typography>
        </Stack>
    );
}
