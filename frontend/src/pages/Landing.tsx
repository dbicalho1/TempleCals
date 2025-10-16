import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import type { ElementType } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import SchoolIcon from "@mui/icons-material/School";
import { motion } from "framer-motion";

type Feature = {
  title: string;
  description: string;
  icon: ElementType;
};

type Testimonial = {
  quote: string;
  source: string;
  context: string;
};

const palette = {
  cherry: "#9E1B32",
  cherryDark: "#7E1426",
};

const features: Feature[] = [
  {
    icon: FastfoodIcon,
    title: "Track Meals Easily",
    description:
      "Log meals from Johnson & Hardwick, Morgan's Hall, The Market at Liacouras Walk, and every dining location supported by TempleCals.",
  },
  {
    icon: AssessmentIcon,
    title: "Daily Goals at a Glance",
    description:
      "Calories, protein, carbohydrates, fat, and sodium are summarized in one dashboard sourced from Temple dining data.",
  },
  {
    icon: TipsAndUpdatesIcon,
    title: "Smart Insights",
    description:
      "Receive prompts to balance your day when logged meals push you over or under your target macros.",
  },
  {
    icon: SchoolIcon,
    title: "Made for Students",
    description:
      "TempleCals was built by Temple University students to fit campus schedules, dining plans, and nutrition goals.",
  },
];

const testimonials: Testimonial[] = [
  {
    quote:
      "TempleCals centralizes Temple dining menus and nutrition in one place so students can plan confidently between classes.",
    source: "TempleCals project team",
    context: "TempleCals development notes, Fall 2024",
  },
  {
    quote:
      "Our dashboard highlights calories, macros, and allergens for every meal logged, making campus nutrition transparent.",
    source: "TempleCals engineering update",
    context: "TempleCals progress review, Spring 2025",
  },
];

const footerLinks = [
  { label: "About", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "Support", href: "#support" },
  { label: "Privacy", href: "#privacy" },
];

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Box sx={{ bgcolor: "background.default", color: "text.primary" }}>
      <Box
        component="section"
        sx={{
          pt: { xs: 12, md: 16 },
          pb: { xs: 12, md: 18 },
        }}
      >
        <Container maxWidth="lg">
          <Stack
            spacing={{ xs: 6, md: 8 }}
            alignItems="center"
            textAlign="center"
          >
            <Stack spacing={2} maxWidth={720}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                  }}
                >
                  Track Your Nutrition. Reach Your Goals.
                </Typography>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 400,
                    color: "text.secondary",
                    lineHeight: 1.6,
                  }}
                >
                  TempleCals helps Temple University students stay on top of their
                  health with an easy-to-use nutrition dashboard powered by real
                  campus dining data.
                </Typography>
              </motion.div>
            </Stack>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/register")}
                  sx={{
                    bgcolor: palette.cherry,
                    color: "#ffffff",
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: 999,
                    "&:hover": {
                      bgcolor: palette.cherryDark,
                    },
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/login")}
                  sx={{
                    borderColor: palette.cherry,
                    color: palette.cherry,
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: 999,
                    "&:hover": {
                      borderColor: palette.cherryDark,
                      color: palette.cherryDark,
                      bgcolor: "rgba(158, 27, 50, 0.08)",
                    },
                  }}
                >
                  Sign In
                </Button>
              </Stack>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
              style={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 900,
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  boxShadow: "0 35px 50px -30px rgba(0, 0, 0, 0.35)",
                  overflow: "hidden",
                }}
              >
                <Box
                  component="img"
                  src="/dashboard-preview.png"
                  alt="TempleCals Dashboard Preview"
                  sx={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                  }}
                />
              </Box>
            </motion.div>
          </Stack>
        </Container>
      </Box>

      <Box
        component="section"
        id="features"
        sx={{ bgcolor: "background.paper", py: { xs: 10, md: 12 } }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Stack
              spacing={1.5}
              sx={{ textAlign: "center", mb: 6, alignItems: "center" }}
            >
              <Typography
                component="h2"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "1.8rem", md: "2.2rem" },
                  lineHeight: 1.3,
                }}
              >
                Everything you need in one place
              </Typography>
              <Typography
                component="p"
                sx={{
                  color: "text.secondary",
                  lineHeight: 1.7,
                  maxWidth: 720,
                }}
              >
                TempleCals brings together campus dining menus, nutrition facts,
                and goal tracking so you can focus on learning, training, and
                living well.
              </Typography>
            </Stack>
          </motion.div>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 3,
            }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      p: 1,
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 25px 45px -30px rgba(158, 27, 50, 0.35)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          bgcolor: `${palette.cherry}14`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: palette.cherry,
                        }}
                      >
                        <Icon />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", lineHeight: 1.7 }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </Box>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 10, md: 12 } }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 6,
              alignItems: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Box>
                <Stack spacing={2}>
                  <Typography
                    variant="overline"
                    sx={{
                      letterSpacing: 2,
                      fontWeight: 600,
                      color: palette.cherry,
                    }}
                  >
                    VISUALIZE PROGRESS
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    Understand every day at a glance
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", lineHeight: 1.7 }}
                  >
                    Detailed charts break down calories, protein, carbs, fat, and
                    sodium pulled directly from meal entries. Monitor streaks,
                    spot trends, and adjust plans before the day ends.
                  </Typography>
                </Stack>
              </Box>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Box>
                <Box
                  sx={{
                    borderRadius: 4,
                    p: { xs: 3, md: 4 },
                    bgcolor: "background.paper",
                    boxShadow: "0 30px 55px -40px rgba(0, 0, 0, 0.45)",
                    width: "100%",
                    maxWidth: 560,
                    mx: "auto",
                  }}
                >
                <Stack spacing={3} alignItems="center">
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: palette.cherry,
                      textAlign: "center",
                    }}
                  >
                    Macro progress preview
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: 2,
                      width: "100%",
                    }}
                  >
                    {[
                      { label: "Calories", value: "1,950 / 2,200" },
                      { label: "Protein", value: "105 g / 130 g" },
                      { label: "Carbs", value: "210 g / 250 g" },
                      { label: "Fat", value: "55 g / 70 g" },
                    ].map((metric) => (
                      <Box
                        key={metric.label}
                        sx={{
                          borderRadius: 3,
                          bgcolor: "background.default",
                          p: 2,
                          textAlign: "center",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          {metric.label}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          {metric.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box
                    sx={{
                      mt: 1,
                      borderRadius: 3,
                      bgcolor: "background.default",
                      p: 3,
                      width: "100%",
                    }}
                  >
                    <Stack spacing={1.5}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Trend insight
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", lineHeight: 1.6 }}
                      >
                        TempleCals highlights when you are above or below goal
                        so you can adjust your next meal instead of waiting
                        until the week ends.
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </Box>
            </motion.div>
          </Box>
        </Container>
      </Box>

      <Box
        component="section"
        sx={{ bgcolor: "background.paper", py: { xs: 10, md: 12 } }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Stack spacing={2} sx={{ textAlign: "center", mb: 6, alignItems: "center" }}>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                Built with real Temple feedback
              </Typography>
              <Typography
                variant="body1"
                sx={{ 
                  color: "text.secondary", 
                  maxWidth: 640,
                  textAlign: "center",
                  lineHeight: 1.7
                }}
              >
                These reflections come straight from TempleCals progress reviews
                and planning sessions with the project team.
              </Typography>
            </Stack>
          </motion.div>
          <Box sx={{ maxWidth: 900, mx: "auto" }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 3,
              }}
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.quote}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      bgcolor: "background.default",
                      p: { xs: 3, md: 4 },
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                      "{testimonial.quote}"
                    </Typography>
                    <Divider />
                    <Stack spacing={0.5}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: palette.cherry }}
                      >
                        {testimonial.source}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        {testimonial.context}
                      </Typography>
                    </Stack>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 10, md: 12 } }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                Start building healthier habits today
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", maxWidth: 540 }}
              >
                Create your TempleCals account to log meals, set goals, and see
                every macro in one dashboard built for Temple University life.
              </Typography>
              <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/register")}
                  sx={{
                    bgcolor: palette.cherry,
                    color: "#ffffff",
                    fontWeight: 700,
                    px: 5,
                    py: 1.6,
                    borderRadius: 999,
                    "&:hover": {
                      bgcolor: palette.cherryDark,
                    },
                  }}
                >
                  Sign Up Now
                </Button>
                <Button
                  variant="text"
                  size="large"
                  onClick={() => navigate("/login")}
                  sx={{ color: palette.cherry, fontWeight: 600 }}
                >
                  Already have an account? Log in
                </Button>
              </Stack>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      <Box
        component="footer"
        sx={{ bgcolor: "background.paper", color: "text.primary", py: 6, borderTop: 1, borderColor: "divider" }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              🍒 TempleCals
            </Typography>
            <Stack
              direction="row"
              spacing={3}
              flexWrap="wrap"
              justifyContent="center"
              sx={{ gap: 2 }}
            >
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  underline="none"
                  sx={{
                    color: "text.secondary",
                    fontSize: 14,
                    "&:hover": { color: "text.primary" },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
            <Typography variant="caption" sx={{ opacity: 0.6 }}>
              © 2025 TempleCals. All rights reserved.
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
