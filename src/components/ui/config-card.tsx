import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Button,
    Typography,
    Stack,
    Divider,
    Avatar,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useRouter } from 'next/navigation';
import { CompanyConfigWithId } from "@/types/company-config";
import ChipsArray from "./chip-array";

export default function ConfigCard({
    config,
    onEdit,
    onDelete,
}: {
    config: CompanyConfigWithId;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const router = useRouter();

    return (
        <Card sx={{ borderRadius: 2, boxShadow: 1, flexDirection: 'column', gap: 1, p: 2 }}>
            <CardHeader
                avatar={<Avatar src={config.logoUrl} sx={{ width: 56, height: 56 }} />}
                title={
                    <Typography variant="subtitle1" sx={{ flex: 1 }}>
                        <strong>   {config.companyDescription}                        </strong>
                    </Typography>
                }
                sx={{ pb: 1 }}
            />
            <CardContent sx={{ pt: 0, pb: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Keywords:</Typography>
                <ChipsArray chipdata={config.keywords || []} />
                <Divider sx={{ my: 2 }} />
                <Stack direction="row" alignItems="center">
                    <LocationOnIcon color="primary" />
                    <Button href={config.googleMapsUrl} target="_blank" size="small" variant="text" sx={{ textTransform: 'none' }}>
                        View on Google Maps
                    </Button>
                </Stack>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end', gap: 1, pt: 1 }}>
                <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    sx={{
                        backgroundColor: '#1976d2',
                        color: 'white',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#115293',
                        },
                    }}
                    onClick={() => window.open(`/${config.id}`, '_blank')}
                >
                    Open
                </Button>

                <Button
                    variant="outlined"
                    size="small"
                    color="info"
                    sx={{
                        borderColor: '#0288d1',
                        color: '#0288d1',
                        textTransform: 'none',
                        '&:hover': {
                            borderColor: '#0277bd',
                            backgroundColor: '#e1f5fe',
                        },
                    }}
                    onClick={onEdit}
                >
                    Edit
                </Button>

                <Button
                    size="small"
                    variant="contained"
                    color="error"
                    sx={{
                        textTransform: 'none',
                        boxShadow: 'none',
                        '&:hover': {
                            backgroundColor: '#c62828',
                        },
                    }}
                    onClick={onDelete}
                >
                    Delete
                </Button>
            </CardActions>
        </Card>
    );
}
