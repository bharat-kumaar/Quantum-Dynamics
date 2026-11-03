const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const Project = require("../models/project");
const Media = require("../models/media");

const seedProjectsAndMedia = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/quantum-dynamics-db";
  console.log("Connecting to database:", mongoUri);
  await mongoose.connect(mongoUri);

  // 1. Ensure Admin User
  let admin = await User.findOne({ email: "bharatkumar70233@gmail.com" });
  if (!admin) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);
    admin = await User.create({
      name: "Bharat Kumar",
      email: "bharatkumar70233@gmail.com",
      password: hashedPassword,
      role: "admin",
      department: "Core Engineering"
    });
  }

  // 2. Ensure Team Members
  const teamMembersData = [
    { name: "Dr. Sarah Chen", email: "sarah.chen@quantumdynamics.com", role: "Team Lead", department: "Quantum Cryptography" },
    { name: "Alex Mercer", email: "alex.mercer@quantumdynamics.com", role: "Developer", department: "Core Engineering" },
    { name: "Marcus Vance", email: "marcus.vance@quantumdynamics.com", role: "Project Manager", department: "Operations Matrix" }
  ];

  const teamUsers = [admin];
  for (const tm of teamMembersData) {
    let u = await User.findOne({ email: tm.email });
    if (!u) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("password123", salt);
      u = await User.create({
        ...tm,
        password: hashedPassword
      });
      console.log(`Seeded team operative: ${u.name}`);
    }
    teamUsers.push(u);
  }

  // 3. Clear existing projects & media to avoid duplicate clutter and re-seed cleanly
  await Project.deleteMany({});
  await Media.deleteMany({});
  console.log("Existing projects and media reset for fresh seed.");

  // 4. Create ~42 Comprehensive Enterprise Projects
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const rawProjects = [
    {
      name: "Project Quantum Core",
      client: "Quantum Dynamics Labs",
      status: "IN PROGRESS",
      description: "Core quantum compute node architecture, subatomic qubit entanglement control, and low-latency neural telemetry grid.",
      dueDate: new Date(now + 30 * dayMs),
      teamLead: "Bharat Kumar",
      team: [admin._id, teamUsers[1]._id],
      milestones: [
        { title: "Cryogenic Qubit Stabilization", status: "Completed", dueDate: new Date(now - 10 * dayMs) },
        { title: "Entanglement Bridge Deployment", status: "In Progress", dueDate: new Date(now + 15 * dayMs) },
        { title: "Real-Time Telemetry Streaming", status: "Pending", dueDate: new Date(now + 30 * dayMs) }
      ]
    },
    {
      name: "Neural Synapse Protocol v4",
      client: "CyberDyne Aerospace",
      status: "IN PROGRESS",
      description: "Distributed zero-trust avionics firmware with cryptographic authentication, hardware enclaves, and automated anomaly interception.",
      dueDate: new Date(now + 45 * dayMs),
      teamLead: "Dr. Sarah Chen",
      team: [admin._id, teamUsers[1]._id, teamUsers[2]._id],
      milestones: [
        { title: "Avionics Zero-Trust Review", status: "Completed", dueDate: new Date(now - 14 * dayMs) },
        { title: "Hardware Enclave Verification", status: "In Progress", dueDate: new Date(now + 20 * dayMs) },
        { title: "Suborbital Live Telemetry Trial", status: "Pending", dueDate: new Date(now + 45 * dayMs) }
      ]
    },
    {
      name: "Hyperion AI Gateway",
      client: "Aetheria Corp",
      status: "COMPLETED",
      description: "High-throughput LLM neural inference router with distributed vector indexing, rate-limiting, and multi-region failover.",
      dueDate: new Date(now - 5 * dayMs),
      teamLead: "Alex Mercer",
      team: [teamUsers[2]._id, admin._id],
      milestones: [
        { title: "Vector Index Partitioning", status: "Completed", dueDate: new Date(now - 30 * dayMs) },
        { title: "Low-Latency Gateway Gateway Stress Test", status: "Completed", dueDate: new Date(now - 15 * dayMs) },
        { title: "Production Cluster Rollout", status: "Completed", dueDate: new Date(now - 5 * dayMs) }
      ]
    },
    {
      name: "Project Chronos Zero",
      client: "Helios Energy Systems",
      status: "PLANNING",
      description: "Next-gen fusion reactor containment telemetry and plasma magnetic confinement modeling engine.",
      dueDate: new Date(now + 90 * dayMs),
      teamLead: "Bharat Kumar",
      team: [admin._id, teamUsers[3]._id],
      milestones: [
        { title: "Plasma Simulation Math Verification", status: "Completed", dueDate: new Date(now - 5 * dayMs) },
        { title: "Magnetic Coils Controller Firmware", status: "In Progress", dueDate: new Date(now + 40 * dayMs) },
        { title: "Full Containment Live Fire Test", status: "Pending", dueDate: new Date(now + 90 * dayMs) }
      ]
    },
    {
      name: "Vanguard Mesh Network",
      client: "Tokyo Cybernetics Group",
      status: "IN PROGRESS",
      description: "Autonomous ad-hoc wireless mesh communication protocol with peer-to-peer encrypted relays and jamming resistance.",
      dueDate: new Date(now + 20 * dayMs),
      teamLead: "Dr. Sarah Chen",
      team: [teamUsers[1]._id, teamUsers[2]._id],
      milestones: [
        { title: "Radio Frequency Topology Design", status: "Completed", dueDate: new Date(now - 20 * dayMs) },
        { title: "Jamming Resistance Trials", status: "In Progress", dueDate: new Date(now + 10 * dayMs) },
        { title: "Urban Density Deployment", status: "Pending", dueDate: new Date(now + 20 * dayMs) }
      ]
    },
    {
      name: "Titan DeepVault Archival",
      client: "Stark Orbital Dynamics",
      status: "IN PROGRESS",
      description: "Cold-storage holographic optical disc archival system with quantum-resistant key rotation and immutable audit logging.",
      dueDate: new Date(now + 60 * dayMs),
      teamLead: "Alex Mercer",
      team: [teamUsers[2]._id, admin._id],
      milestones: [
        { title: "Optical Crystal Layer Testing", status: "Completed", dueDate: new Date(now - 8 * dayMs) },
        { title: "Quantum Key Rotator Daemon", status: "In Progress", dueDate: new Date(now + 30 * dayMs) },
        { title: "Petabyte Cold Vault Verification", status: "Pending", dueDate: new Date(now + 60 * dayMs) }
      ]
    },
    {
      name: "Aegis Cyber Defense Matrix",
      client: "Federal Security Bureau",
      status: "COMPLETED",
      description: "Autonomous SIEM threat-hunting agent matrix with automated micro-isolation, containment, and forensic trace generation.",
      dueDate: new Date(now - 15 * dayMs),
      teamLead: "Marcus Vance",
      team: [teamUsers[3]._id, admin._id],
      milestones: [
        { title: "SIEM Agent Swarm Deployment", status: "Completed", dueDate: new Date(now - 45 * dayMs) },
        { title: "Containment Micro-Isolation Testing", status: "Completed", dueDate: new Date(now - 25 * dayMs) },
        { title: "Final Federal Clearance Audit", status: "Completed", dueDate: new Date(now - 15 * dayMs) }
      ]
    },
    {
      name: "Project Prometheus Fusion Drive",
      client: "Astraea Propulsion Labs",
      status: "IN PROGRESS",
      description: "Magneto-inertial fusion propulsion telemetry, continuous thrust vectoring control, and deep-space trajectory calculations.",
      dueDate: new Date(now + 75 * dayMs),
      teamLead: "Bharat Kumar",
      team: [admin._id, teamUsers[1]._id],
      milestones: [
        { title: "Thrust Vectoring Mathematical Model", status: "Completed", dueDate: new Date(now - 12 * dayMs) },
        { title: "Superconducting Magnet Cryo-Test", status: "In Progress", dueDate: new Date(now + 35 * dayMs) },
        { title: "Static Fire Exhaust Velocity Run", status: "Pending", dueDate: new Date(now + 75 * dayMs) }
      ]
    },
    {
      name: "Zero-Day Sentinel Engine",
      client: "ShadowNet Defense Group",
      status: "COMPLETED",
      description: "Real-time binary decompilation and automated exploit payload disarming engine powered by neural heuristics.",
      dueDate: new Date(now - 22 * dayMs),
      teamLead: "Dr. Sarah Chen",
      team: [teamUsers[1]._id, teamUsers[2]._id],
      milestones: [
        { title: "Heuristic Disassembly Engine", status: "Completed", dueDate: new Date(now - 60 * dayMs) },
        { title: "Kernel Hook Interception Sandbox", status: "Completed", dueDate: new Date(now - 40 * dayMs) },
        { title: "Global Defense Node Deployment", status: "Completed", dueDate: new Date(now - 22 * dayMs) }
      ]
    },
    {
      name: "Orbital Telemetry Swarm v2",
      client: "SpaceX Dynamics",
      status: "IN PROGRESS",
      description: "Low-Earth orbit satellite swarm constellation coordination, inter-satellite laser optical links, and orbital drift correction.",
      dueDate: new Date(now + 50 * dayMs),
      teamLead: "Alex Mercer",
      team: [teamUsers[2]._id, teamUsers[3]._id],
      milestones: [
        { title: "Inter-Satellite Laser Interlink Spec", status: "Completed", dueDate: new Date(now - 5 * dayMs) },
        { title: "Autonomous Collision Avoidance Logic", status: "In Progress", dueDate: new Date(now + 25 * dayMs) },
        { title: "Full Constellation Telemetry Lock", status: "Pending", dueDate: new Date(now + 50 * dayMs) }
      ]
    },
    {
      name: "Bio-Neural Interface Bridge",
      client: "Neuralink Cybernetics",
      status: "PLANNING",
      description: "Ultra-low-latency direct cortical implant decoder with high-bandwidth microelectrode telemetry and spike sorting.",
      dueDate: new Date(now + 120 * dayMs),
      teamLead: "Bharat Kumar",
      team: [admin._id, teamUsers[1]._id, teamUsers[3]._id],
      milestones: [
        { title: "Spike Sorting Neural Algorithm", status: "Completed", dueDate: new Date(now - 2 * dayMs) },
        { title: "Biocompatible Ceramic Packaging", status: "In Progress", dueDate: new Date(now + 60 * dayMs) },
        { title: "Simulated Cortical Telemetry Trial", status: "Pending", dueDate: new Date(now + 120 * dayMs) }
      ]
    },
    {
      name: "Cryptographic Lattice Foundry",
      client: "CERN Quantum Division",
      status: "IN PROGRESS",
      description: "Post-quantum lattice cryptography accelerator module implementing Kyber and Dilithium schemes in FPGA hardware.",
      dueDate: new Date(now + 38 * dayMs),
      teamLead: "Dr. Sarah Chen",
      team: [teamUsers[1]._id, admin._id],
      milestones: [
        { title: "ML-KEM 1024 RTL Synthesis", status: "Completed", dueDate: new Date(now - 18 * dayMs) },
        { title: "Side-Channel Attack Hardening", status: "In Progress", dueDate: new Date(now + 15 * dayMs) },
        { title: "Tapeout Fabrication Verification", status: "Pending", dueDate: new Date(now + 38 * dayMs) }
      ]
    },
    {
      name: "Autonomous Drone Fleet Swarm",
      client: "Skydio Defense Systems",
      status: "COMPLETED",
      description: "GPS-denied visual SLAM navigation, flocking behavior coordination, and automated perimeter patrol protocols.",
      dueDate: new Date(now - 8 * dayMs),
      teamLead: "Marcus Vance",
      team: [teamUsers[3]._id, teamUsers[2]._id],
      milestones: [
        { title: "Visual-Inertial Odometry Kernel", status: "Completed", dueDate: new Date(now - 45 * dayMs) },
        { title: "Swarm Flocking Decentralized Mesh", status: "Completed", dueDate: new Date(now - 25 * dayMs) },
        { title: "Full Perimeter Defense Field Trial", status: "Completed", dueDate: new Date(now - 8 * dayMs) }
      ]
    },
    {
      name: "Subatomic Particle Collator",
      client: "Geneva High-Energy Labs",
      status: "PLANNING",
      description: "Picosecond-level calorimeter event sorting and detector readouts for high-luminosity hadron collision experiments.",
      dueDate: new Date(now + 110 * dayMs),
      teamLead: "Bharat Kumar",
      team: [admin._id, teamUsers[2]._id],
      milestones: [
        { title: "Detector Signal Trigger Prototype", status: "Completed", dueDate: new Date(now - 10 * dayMs) },
        { title: "High-Bandwidth Fiber Interconnects", status: "In Progress", dueDate: new Date(now + 50 * dayMs) },
        { title: "Beam Injection Real-Time Calibration", status: "Pending", dueDate: new Date(now + 110 * dayMs) }
      ]
    },
    {
      name: "Cybernetic Exoskeleton Mk VII",
      client: "Apex Heavy Industries",
      status: "IN PROGRESS",
      description: "Hydraulic-electric hybrid load-bearing exoskeleton with predictive intent sensors and neural EMG muscle telemetry.",
      dueDate: new Date(now + 28 * dayMs),
      teamLead: "Dr. Sarah Chen",
      team: [teamUsers[1]._id, teamUsers[3]._id],
      milestones: [
        { title: "EMG Sensor Filtering & Calibration", status: "Completed", dueDate: new Date(now - 15 * dayMs) },
        { title: "Hydraulic Pressure Balancing Valve", status: "In Progress", dueDate: new Date(now + 12 * dayMs) },
        { title: "Max Load 300kg Ergonomic Run", status: "Pending", dueDate: new Date(now + 28 * dayMs) }
      ]
    },
    {
      name: "Deep Marine Sonic Mapper",
      client: "Oceanic Telemetry Corp",
      status: "IN PROGRESS",
      description: "Autonomous underwater vehicle multibeam sonar array mapping sub-surface trenches down to 11,000 meters depth.",
      dueDate: new Date(now + 42 * dayMs),
      teamLead: "Alex Mercer",
      team: [teamUsers[2]._id, admin._id],
      milestones: [
        { title: "Titanium Pressure Hull Certification", status: "Completed", dueDate: new Date(now - 22 * dayMs) },
        { title: "Synthetic Aperture Sonar Pipeline", status: "In Progress", dueDate: new Date(now + 18 * dayMs) },
        { title: "Challenger Deep Automated Descent", status: "Pending", dueDate: new Date(now + 42 * dayMs) }
      ]
    },
    {
      name: "Quantum Key Distribution Satellite",
      client: "European Space Agency",
      status: "COMPLETED",
      description: "Space-to-ground entangled photon beam transmitter securing intercontinental bank settlements and diplomatic channels.",
      dueDate: new Date(now - 12 * dayMs),
      teamLead: "Bharat Kumar",
      team: [admin._id, teamUsers[1]._id],
      milestones: [
        { title: "Beam Fine Pointing Optical Mirror", status: "Completed", dueDate: new Date(now - 50 * dayMs) },
        { title: "Atmospheric Turbulence Correction", status: "Completed", dueDate: new Date(now - 30 * dayMs) },
        { title: "Intercontinental QKD Demonstration", status: "Completed", dueDate: new Date(now - 12 * dayMs) }
      ]
    },
    {
      name: "Dark Matter Flux Detector",
      client: "Kavli Institute of Physics",
      status: "PLANNING",
      description: "Cryogenic liquid xenon scintillation tank instrumentation monitoring WIMP dark matter recoil telemetry.",
      dueDate: new Date(now + 130 * dayMs),
      teamLead: "Dr. Sarah Chen",
      team: [teamUsers[1]._id, teamUsers[2]._id],
      milestones: [
        { title: "Low-Background Photomultiplier Tests", status: "Completed", dueDate: new Date(now - 1 * dayMs) },
        { title: "Liquid Xenon Cryostat Integration", status: "In Progress", dueDate: new Date(now + 65 * dayMs) },
        { title: "Underground Mine Dark Shielding", status: "Pending", dueDate: new Date(now + 130 * dayMs) }
      ]
    },
    {
      name: "Supersonic Avionics Kernel",
      client: "Lockheed Martin Skunkworks",
      status: "IN PROGRESS",
      description: "Deterministic real-time operating system kernel for Mach 5+ atmospheric flight envelope control.",
      dueDate: new Date(now + 35 * dayMs),
      teamLead: "Alex Mercer",
      team: [teamUsers[2]._id, teamUsers[3]._id],
      milestones: [
        { title: "POSIX Hard Real-Time Guarantee", status: "Completed", dueDate: new Date(now - 16 * dayMs) },
        { title: "High-Temperature Thermal Sensor Bus", status: "In Progress", dueDate: new Date(now + 14 * dayMs) },
        { title: "Mach 5.2 Wind Tunnel Simulation", status: "Pending", dueDate: new Date(now + 35 * dayMs) }
      ]
    },
    {
      name: "Neural Language Core 90B",
      client: "Anthropic Research Grid",
      status: "COMPLETED",
      description: "Constitutional reasoning language model pre-training run utilizing 16,384 cluster tensor processing cores.",
      dueDate: new Date(now - 18 * dayMs),
      teamLead: "Bharat Kumar",
      team: [admin._id, teamUsers[2]._id],
      milestones: [
        { title: "Billion-Token Pre-Tokenization", status: "Completed", dueDate: new Date(now - 65 * dayMs) },
        { title: "16K TPUs Distributed Gradient Sync", status: "Completed", dueDate: new Date(now - 35 * dayMs) },
        { title: "Constitutional RLHF Alignment Run", status: "Completed", dueDate: new Date(now - 18 * dayMs) }
      ]
    },
    {
      name: "Holographic HUD Optics Matrix",
      client: "Apple Spatial Computing",
      status: "IN PROGRESS",
      description: "Diffractive waveguide micro-displays delivering 8K resolution per eye with retinal scan pupil tracking.",
      dueDate: new Date(now + 55 * dayMs),
      teamLead: "Marcus Vance",
      team: [teamUsers[3]._id, admin._id],
      milestones: [
        { title: "Diffractive Optical Grating Etching", status: "Completed", dueDate: new Date(now - 10 * dayMs) },
        { title: "Retinal Pupil Tracking 240Hz", status: "In Progress", dueDate: new Date(now + 28 * dayMs) },
        { title: "Ultra-Light Carbon Composite Frame", status: "Pending", dueDate: new Date(now + 55 * dayMs) }
      ]
    },
    {
      name: "High-Yield Microgrid Battery",
      client: "Tesla Gigafactory Energy",
      status: "COMPLETED",
      description: "Solid-state silicon-anode battery pack telemetry management with adaptive pulse charging and thermal runaway prevention.",
      dueDate: new Date(now - 3 * dayMs),
      teamLead: "Dr. Sarah Chen",
      team: [teamUsers[1]._id, teamUsers[3]._id],
      milestones: [
        { title: "Solid Electrolyte Dendrite Barrier", status: "Completed", dueDate: new Date(now - 40 * dayMs) },
        { title: "Adaptive Fast Charging Algorithm", status: "Completed", dueDate: new Date(now - 20 * dayMs) },
        { title: "1000-Cycle Endurance Benchmark", status: "Completed", dueDate: new Date(now - 3 * dayMs) }
      ]
    },
    {
      name: "Autonomous Mars Rover Guidance",
      client: "NASA Jet Propulsion Laboratory",
      status: "IN PROGRESS",
      description: "Terrain hazard avoidance, autonomous path planning over rocky Martian regolith, and geological sampling telemetry.",
      dueDate: new Date(now + 80 * dayMs),
      teamLead: "Bharat Kumar",
      team: [admin._id, teamUsers[1]._id, teamUsers[2]._id],
      milestones: [
        { title: "Stereo Vision Hazard Classifier", status: "Completed", dueDate: new Date(now - 14 * dayMs) },
        { title: "Wheel Torque & Slip Minimizer", status: "In Progress", dueDate: new Date(now + 40 * dayMs) },
        { title: "20-Kilometer Autonomous Traverse", status: "Pending", dueDate: new Date(now + 80 * dayMs) }
      ]
    },
    {
      name: "Atmospheric Carbon Extraction",
      client: "Global Climate Initiative",
      status: "PLANNING",
      description: "Direct air capture chemical scrubbing units powered by geothermal energy with automated basalt mineralization injection.",
      dueDate: new Date(now + 105 * dayMs),
      teamLead: "Alex Mercer",
      team: [teamUsers[2]._id, teamUsers[3]._id],
      milestones: [
        { title: "Amine Sorbent Chemical Optimization", status: "Completed", dueDate: new Date(now - 6 * dayMs) },
        { title: "Geothermal Power Feed Synchronization", status: "In Progress", dueDate: new Date(now + 50 * dayMs) },
        { title: "10,000 Ton/Year Mineralization Run", status: "Pending", dueDate: new Date(now + 105 * dayMs) }
      ]
    },
    {
      name: "Quantum Annealing Optimizer",
      client: "D-Wave Enterprise Systems",
      status: "IN PROGRESS",
      description: "Ising model Hamiltonian optimization processor applied to global supply chain routing and maritime fleet schedules.",
      dueDate: new Date(now + 24 * dayMs),
      teamLead: "Dr. Sarah Chen",
      team: [teamUsers[1]._id, admin._id],
      milestones: [
        { title: "Quadratic Unconstrained Model Mapper", status: "Completed", dueDate: new Date(now - 18 * dayMs) },
        { title: "5000-Qubit Annealing Pulse Tuning", status: "In Progress", dueDate: new Date(now + 10 * dayMs) },
        { title: "Real-Time Maritime Route Solver", status: "Pending", dueDate: new Date(now + 24 * dayMs) }
      ]
    },
    {
      name: "Hypersonic Glider Telemetry",
      client: "DARPA Advanced Aerospace",
      status: "IN PROGRESS",
      description: "High-temperature boundary layer plasma telemetry sensor pods surviving extreme Mach 12 reentry friction.",
      dueDate: new Date(now + 65 * dayMs),
      teamLead: "Bharat Kumar",
      team: [admin._id, teamUsers[3]._id],
      milestones: [
        { title: "Carbon-Carbon Aerodynamic Leading Edge", status: "Completed", dueDate: new Date(now - 12 * dayMs) },
        { title: "Plasma Blackout Radio Bypass Link", status: "In Progress", dueDate: new Date(now + 30 * dayMs) },
        { title: "Suborbital Drop Telemetry Validation", status: "Pending", dueDate: new Date(now + 65 * dayMs) }
      ]
    },
    {
      name: "Optical Neural Router 100Tbps",
      client: "Cisco Advanced Research",
      status: "COMPLETED",
      description: "All-optical photonic packet routing matrix eliminating electrical-optical conversions in hyperscale data center backbones.",
      dueDate: new Date(now - 25 * dayMs),
      teamLead: "Alex Mercer",
      team: [teamUsers[2]._id, teamUsers[1]._id],
      milestones: [
        { title: "Silicon Photonics Waveguide Foundry", status: "Completed", dueDate: new Date(now - 60 * dayMs) },
        { title: "Nanosecond Optical Crossbar Switch", status: "Completed", dueDate: new Date(now - 40 * dayMs) },
        { title: "100 Terabit Sustained Throughput", status: "Completed", dueDate: new Date(now - 25 * dayMs) }
      ]
    },
    {
      name: "Sub-Zero Superconductor Rail",
      client: "Japan Maglev Central",
      status: "IN PROGRESS",
      description: "High-temperature YBCO superconductor magnetic levitation bogie telemetry ensuring sub-millimeter levitation stability at 600 km/h.",
      dueDate: new Date(now + 32 * dayMs),
      teamLead: "Marcus Vance",
      team: [teamUsers[3]._id, admin._id],
      milestones: [
        { title: "Cryocooler Redundancy Loop Test", status: "Completed", dueDate: new Date(now - 15 * dayMs) },
        { title: "Dynamic Levitation Gap Controller", status: "In Progress", dueDate: new Date(now + 12 * dayMs) },
        { title: "Full Track 603 km/h High Speed Run", status: "Pending", dueDate: new Date(now + 32 * dayMs) }
      ]
    },
    {
      name: "Synthetic DNA Data Vault",
      client: "Illumina Genomic Storage",
      status: "PLANNING",
      description: "Enzymatic DNA synthesis writer converting digital binary archives into nucleotide base pairs with 1,000-year shelf life.",
      dueDate: new Date(now + 115 * dayMs),
      teamLead: "Dr. Sarah Chen",
      team: [teamUsers[1]._id, teamUsers[2]._id],
      milestones: [
        { title: "Error-Correction Reed-Solomon Codec", status: "Completed", dueDate: new Date(now - 4 * dayMs) },
        { title: "Microfluidic Synthesizer Array", status: "In Progress", dueDate: new Date(now + 55 * dayMs) },
        { title: "Exabyte Archival Density Validation", status: "Pending", dueDate: new Date(now + 115 * dayMs) }
      ]
    },
    {
      name: "Smart Grid Self-Healing Node",
      client: "Siemens Energy Matrix",
      status: "COMPLETED",
      description: "Decentralized distribution grid controllers that automatically reroute medium-voltage power around transmission faults in under 16ms.",
      dueDate: new Date(now - 14 * dayMs),
      teamLead: "Bharat Kumar",
      team: [admin._id, teamUsers[3]._id],
      milestones: [
        { title: "Phasor Measurement Unit Analytics", status: "Completed", dueDate: new Date(now - 45 * dayMs) },
        { title: "Autonomous Breaker Tripping Protocol", status: "Completed", dueDate: new Date(now - 28 * dayMs) },
        { title: "Regional Grid Blackstart Simulation", status: "Completed", dueDate: new Date(now - 14 * dayMs) }
      ]
    },
    {
      name: "Asteroid Mineral Spectral Scout",
      client: "Planetary Resources Inc",
      status: "IN PROGRESS",
      description: "Deep space CubeSat spectroscopic infrared scanner analyzing near-Earth asteroid platinum-group metal concentrations.",
      dueDate: new Date(now + 48 * dayMs),
      teamLead: "Alex Mercer",
      team: [teamUsers[2]._id, admin._id],
      milestones: [
        { title: "Infrared Spectrometer Calibration", status: "Completed", dueDate: new Date(now - 8 * dayMs) },
        { title: "Ion Engine Low-Thrust Trajectory", status: "In Progress", dueDate: new Date(now + 22 * dayMs) },
        { title: "Target Asteroid 162173 Rendezvous", status: "Pending", dueDate: new Date(now + 48 * dayMs) }
      ]
    },
    {
      name: "Tactical Battlefield Mesh HUD",
      client: "Raytheon Intelligence",
      status: "COMPLETED",
      description: "Soldier helmet-mounted augmented reality display overlaying real-time satellite drone feeds and thermal threat signatures.",
      dueDate: new Date(now - 9 * dayMs),
      teamLead: "Marcus Vance",
      team: [teamUsers[3]._id, teamUsers[1]._id],
      milestones: [
        { title: "Millimeter-Wave Localizer Integration", status: "Completed", dueDate: new Date(now - 50 * dayMs) },
        { title: "Zero-Latency Video Over Mesh", status: "Completed", dueDate: new Date(now - 30 * dayMs) },
        { title: "Special Operations Field Evaluation", status: "Completed", dueDate: new Date(now - 9 * dayMs) }
      ]
    },
    {
      name: "Bio-Synthetic Organ Printer",
      client: "Oxford Regenerative Labs",
      status: "PLANNING",
      description: "Sub-cellular resolution bioprinting platform synthesizing vascularized hepatic and cardiac tissue matrices.",
      dueDate: new Date(now + 140 * dayMs),
      teamLead: "Dr. Sarah Chen",
      team: [teamUsers[1]._id, admin._id],
      milestones: [
        { title: "Extracellular Matrix Bio-Ink Assay", status: "Completed", dueDate: new Date(now - 2 * dayMs) },
        { title: "Micro-Vascular Capillary Laser Printing", status: "In Progress", dueDate: new Date(now + 70 * dayMs) },
        { title: "Living Tissue Perfusion Viability", status: "Pending", dueDate: new Date(now + 140 * dayMs) }
      ]
    },
    {
      name: "Quantum Random Number Beacons",
      client: "Cloudflare Cryptography",
      status: "COMPLETED",
      description: "Shot-noise vacuum fluctuation quantum random number generator broadcasting verified randomness beacons globally.",
      dueDate: new Date(now - 16 * dayMs),
      teamLead: "Bharat Kumar",
      team: [admin._id, teamUsers[2]._id],
      milestones: [
        { title: "Optical Beam Splitter Shot-Noise", status: "Completed", dueDate: new Date(now - 55 * dayMs) },
        { title: "NIST SP 800-22 Randomness Tests", status: "Completed", dueDate: new Date(now - 35 * dayMs) },
        { title: "High-Availability Anycast API Push", status: "Completed", dueDate: new Date(now - 16 * dayMs) }
      ]
    },
    {
      name: "Stratospheric High-Altitude Relay",
      client: "Alphabet Loon Legacy Grid",
      status: "IN PROGRESS",
      description: "Autonomous solar-powered stratospheric balloons maintaining persistent 5G broadband coverage over disaster regions.",
      dueDate: new Date(now + 36 * dayMs),
      teamLead: "Alex Mercer",
      team: [teamUsers[2]._id, teamUsers[3]._id],
      milestones: [
        { title: "Stratospheric Wind Stratification Model", status: "Completed", dueDate: new Date(now - 14 * dayMs) },
        { title: "Ultra-Light 5G Beamforming Phased Array", status: "In Progress", dueDate: new Date(now + 15 * dayMs) },
        { title: "60-Day Unbroken Station Keeping", status: "Pending", dueDate: new Date(now + 36 * dayMs) }
      ]
    },
    {
      name: "Automated Code Sentinel AI",
      client: "CodeRabbit Autonomous Matrix",
      status: "IN PROGRESS",
      description: "Agentic automated code refactoring, AST security vulnerability patching, and PR review orchestration bot swarm.",
      dueDate: new Date(now + 26 * dayMs),
      teamLead: "Dr. Sarah Chen",
      team: [teamUsers[1]._id, admin._id],
      milestones: [
        { title: "Tree-Sitter Multi-Language Parser", status: "Completed", dueDate: new Date(now - 12 * dayMs) },
        { title: "Automated Security Remediation Agent", status: "In Progress", dueDate: new Date(now + 12 * dayMs) },
        { title: "100k Pull Request Benchmark Test", status: "Pending", dueDate: new Date(now + 26 * dayMs) }
      ]
    },
    {
      name: "Deep Trench Hydrothermal Probe",
      client: "Woods Hole Oceanographic",
      status: "PLANNING",
      description: "Autonomous robotic probe sampling superheated 400°C mineral-rich hydrothermal vents along the Mid-Atlantic Ridge.",
      dueDate: new Date(now + 125 * dayMs),
      teamLead: "Marcus Vance",
      team: [teamUsers[3]._id, teamUsers[2]._id],
      milestones: [
        { title: "Corrosion-Proof Hastelloy Enclosure", status: "Completed", dueDate: new Date(now - 3 * dayMs) },
        { title: "Microbial DNA In-Situ Sequencer", status: "In Progress", dueDate: new Date(now + 60 * dayMs) },
        { title: "Black Smoker Direct Vent Insertion", status: "Pending", dueDate: new Date(now + 125 * dayMs) }
      ]
    },
    {
      name: "Cryogenic Space Telescope Sensor",
      client: "James Webb Extended Array",
      status: "COMPLETED",
      description: "Mid-infrared mercury-cadmium-telluride focal plane detector array cooled to 6 Kelvin for redshift cosmic dawn imaging.",
      dueDate: new Date(now - 7 * dayMs),
      teamLead: "Bharat Kumar",
      team: [admin._id, teamUsers[1]._id],
      milestones: [
        { title: "Cryogenic Pulse Tube Cooler Assembly", status: "Completed", dueDate: new Date(now - 45 * dayMs) },
        { title: "Sub-Electron Readout Noise Characterization", status: "Completed", dueDate: new Date(now - 25 * dayMs) },
        { title: "Space Simulation Thermal Vacuum Bake", status: "Completed", dueDate: new Date(now - 7 * dayMs) }
      ]
    },
    {
      name: "Quantum Resistant TLS Proxy",
      client: "BoringSSL Quantum Working Group",
      status: "IN PROGRESS",
      description: "High-performance edge proxy terminating hybrid classical-quantum TLS 1.3 handshakes at millions of requests per second.",
      dueDate: new Date(now + 33 * dayMs),
      teamLead: "Dr. Sarah Chen",
      team: [teamUsers[1]._id, teamUsers[2]._id],
      milestones: [
        { title: "X25519Kyber768 Assembly Optimization", status: "Completed", dueDate: new Date(now - 10 * dayMs) },
        { title: "Zero-Copy Epoll Network Engine", status: "In Progress", dueDate: new Date(now + 15 * dayMs) },
        { title: "Global CDN Edge Deployment", status: "Pending", dueDate: new Date(now + 33 * dayMs) }
      ]
    },
    {
      name: "Cyber Physical Security Honeynet",
      client: "Mandiant Incident Response",
      status: "COMPLETED",
      description: "Realistic virtualized SCADA, PLC, and industrial water treatment plant honeynet trapping state-sponsored APT intrusions.",
      dueDate: new Date(now - 19 * dayMs),
      teamLead: "Alex Mercer",
      team: [teamUsers[2]._id, admin._id],
      milestones: [
        { title: "Modbus & DNP3 Emulation Layer", status: "Completed", dueDate: new Date(now - 55 * dayMs) },
        { title: "Automated Memory Dump Collector", status: "Completed", dueDate: new Date(now - 35 * dayMs) },
        { title: "APT Threat Intelligence Dossier Release", status: "Completed", dueDate: new Date(now - 19 * dayMs) }
      ]
    },
    {
      name: "Gravitational Wave Interferometer",
      client: "LIGO Hanford Advanced Facility",
      status: "IN PROGRESS",
      description: "Quantum squeezed-light vacuum source injected into 4km arm cavities to detect neutron star merger ripples in spacetime.",
      dueDate: new Date(now + 40 * dayMs),
      teamLead: "Bharat Kumar",
      team: [admin._id, teamUsers[1]._id],
      milestones: [
        { title: "Frequency-Dependent Squeezing Filter", status: "Completed", dueDate: new Date(now - 15 * dayMs) },
        { title: "Suspended Mirror Seismic Isolation", status: "In Progress", dueDate: new Date(now + 18 * dayMs) },
        { title: "O5 Observational Run Data Lock", status: "Pending", dueDate: new Date(now + 40 * dayMs) }
      ]
    },
    {
      name: "Micro-Fusion Plasma Reactor Core",
      client: "Commonwealth Fusion Systems",
      status: "PLANNING",
      description: "High-field rare-earth barium copper oxide tokamak magnets achieving net energy gain Q > 2 in compact footprint.",
      dueDate: new Date(now + 95 * dayMs),
      teamLead: "Marcus Vance",
      team: [teamUsers[3]._id, admin._id],
      milestones: [
        { title: "20-Tesla Toroidal Magnet Demonstration", status: "Completed", dueDate: new Date(now - 5 * dayMs) },
        { title: "Deuterium-Tritium Fuel Injector", status: "In Progress", dueDate: new Date(now + 45 * dayMs) },
        { title: "Net Energy Breakeven Plasma Burn", status: "Pending", dueDate: new Date(now + 95 * dayMs) }
      ]
    }
  ];

  // Map created projects
  const projectsToCreate = rawProjects.map(p => ({
    ...p,
    createdBy: admin._id
  }));

  const createdProjects = await Project.insertMany(projectsToCreate);
  console.log(`✅ Seeded ${createdProjects.length} enterprise projects successfully.`);

  // 5. Seed Media Assets
  const uploadsDir = path.join(__dirname, "../../uploads");
  const uploadFiles = fs.readdirSync(uploadsDir);

  const mediaCatalogue = [
    {
      filenameMatch: "general___1782984716919-iron-man_7680x4320_xtrafondos.com.jpg",
      originalName: "Exoskeleton Schematics & Cybernetic Blueprint.jpg",
      mimetype: "image/jpeg",
      projectIdx: 1 // Neural Synapse Protocol v4
    },
    {
      filenameMatch: "general___1782896939736-futuristic-samurai-with-an-energy-katana_9830x5472_xtrafondos.com.jpg",
      originalName: "Quantum Energy Blade Architecture.jpg",
      mimetype: "image/jpeg",
      projectIdx: 0 // Project Quantum Core
    },
    {
      filenameMatch: "general___1782883736946-italdesign-voyah-i-land-concept-2020-concept-cars-5k-8k-8192x4321-2936.jpg",
      originalName: "Autonomous Vehicle Neural Core Chassis.jpg",
      mimetype: "image/jpeg",
      projectIdx: 14 // Cybernetic Exoskeleton Mk VII
    },
    {
      filenameMatch: "general___1782896524367-xF1EhcdQPM-TwoOfWar-Spider-Man2LiveWallpaper.mp4",
      originalName: "Kinetic Field Telemetry Stream.mp4",
      mimetype: "video/mp4",
      projectIdx: 4 // Vanguard Mesh Network
    },
    {
      filenameMatch: "1781510306777.mp4",
      originalName: "Neural Mesh Simulation Sequence.mp4",
      mimetype: "video/mp4",
      projectIdx: 0
    },
    {
      filenameMatch: "1781508973882.mp4",
      originalName: "Subatomic Particle Collision Recording.mp4",
      mimetype: "video/mp4",
      projectIdx: 13 // Subatomic Particle Collator
    },
    {
      filenameMatch: "general___1782896550876-gta-6-official-5120x2880-13626.zip",
      originalName: "Quantum Firmware Deployment Package.zip",
      mimetype: "application/zip",
      projectIdx: 2 // Hyperion AI Gateway
    },
    {
      filenameMatch: "general___1781529556640-1781256444394-419295269.zip",
      originalName: "Neural Network Weights & Artifacts.zip",
      mimetype: "application/zip",
      projectIdx: 3 // Project Chronos Zero
    },
    {
      filenameMatch: "proj-alpha___1781528554536-full-moon-forest-night-dark-starry-sky-5k-8k-7952x5304-1684.jpg",
      originalName: "Deep Space Telemetry Observation.jpg",
      mimetype: "image/jpeg",
      projectIdx: 9 // Orbital Telemetry Swarm v2
    },
    {
      filenameMatch: "1781508209911-11156224.jpg",
      originalName: "Satellite Ground Station Array.jpg",
      mimetype: "image/jpeg",
      projectIdx: 16 // Quantum Key Distribution Satellite
    },
    {
      filenameMatch: "1781508254499-615233217.jpg",
      originalName: "Quantum Processor Unit Thermal Map.jpg",
      mimetype: "image/jpeg",
      projectIdx: 0
    },
    {
      filenameMatch: "1781508956643.jpg",
      originalName: "Optical Cryocooler Sensor Array.jpg",
      mimetype: "image/jpeg",
      projectIdx: 7 // Project Prometheus Fusion Drive
    },
    {
      filenameMatch: "1781256444394-419295269.jpg",
      originalName: "Subatomic Particle Chamber Diagram.jpg",
      mimetype: "image/jpeg",
      projectIdx: 40 // Gravitational Wave Interferometer
    },
    {
      filenameMatch: "1781257578145-413016803.jpg",
      originalName: "High Energy Flux Plasma Containment.jpg",
      mimetype: "image/jpeg",
      projectIdx: 41 // Micro-Fusion Plasma Reactor Core
    },
    {
      filenameMatch: "general___1793723115885-3d-polygonal-spikes-art_7680x4320_xtrafondos.com.jpg",
      originalName: "Topological Qubit Lattice Model.jpg",
      mimetype: "image/jpeg",
      projectIdx: 11 // Cryptographic Lattice Foundry
    },
    {
      filenameMatch: "quantum_core_v5_architecture_spec.pdf",
      originalName: "Quantum Core Architecture Specification v5.2.pdf",
      mimetype: "application/pdf",
      projectIdx: 0
    },
    {
      filenameMatch: "neural_telemetry_security_audit.pdf",
      originalName: "Neural Telemetry Zero-Trust Security Audit.pdf",
      mimetype: "application/pdf",
      projectIdx: 6 // Aegis Cyber Defense Matrix
    }
  ];

  let mediaCount = 0;
  for (const item of mediaCatalogue) {
    if (uploadFiles.includes(item.filenameMatch)) {
      const filePath = path.join(uploadsDir, item.filenameMatch);
      const stat = fs.statSync(filePath);
      const projectRef = item.projectIdx !== null && createdProjects[item.projectIdx] 
        ? createdProjects[item.projectIdx]._id 
        : null;

      const mediaDoc = await Media.create({
        originalName: item.originalName,
        filename: item.filenameMatch,
        path: filePath,
        mimetype: item.mimetype,
        size: stat.size,
        uploadedBy: admin._id,
        project: projectRef
      });

      // If linked to project, push to project's attachments
      if (projectRef) {
        await Project.findByIdAndUpdate(projectRef, {
          $push: { attachments: mediaDoc._id }
        });
      }

      mediaCount++;
    }
  }

  console.log(`✅ Seeded ${mediaCount} media assets into the vault and linked to projects.`);
  return { projectCount: createdProjects.length, mediaCount };
};

if (require.main === module) {
  seedProjectsAndMedia().then(() => process.exit(0)).catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
}

module.exports = seedProjectsAndMedia;
