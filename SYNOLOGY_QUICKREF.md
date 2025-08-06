# Synology NAS Quick Reference

## 🔧 Text Editing on Synology

Since `nano` is not available by default on Synology NAS, here are your options:

### Option 1: File Station (Recommended for beginners)
1. Open DSM web interface
2. Open **File Station**
3. Navigate to your file
4. Right-click → **Edit** or double-click
5. Edit in the built-in text editor
6. Save

### Option 2: vi Editor (Command line)
```bash
vi filename.txt

# Basic vi commands:
# i          - Enter insert mode (start typing)
# Esc        - Exit insert mode
# :w         - Save file
# :q         - Quit
# :wq        - Save and quit
# :q!        - Quit without saving
```

### Option 3: Create files with cat
```bash
cat > filename.txt << EOF
Your content here
Multiple lines supported
EOF
```

## 🚀 Common Synology Paths

```bash
/volume1/docker/           # Main docker directory
/volume1/homes/            # User home directories  
/usr/local/bin/docker      # Docker binary
/var/services/            # Services directory
```

## 🐳 Docker on Synology

```bash
# Most Docker commands need sudo on Synology NAS
sudo docker --version
sudo docker-compose --version

# Check if docker-compose is available
which docker-compose
which /usr/local/bin/docker-compose

# Test Docker daemon access
docker ps                    # May fail with permission denied
sudo docker ps              # Should work

# Common Docker Compose commands (with sudo)
sudo docker-compose up -d
sudo docker-compose down  
sudo docker-compose ps
sudo docker-compose logs -f
```

### Docker Permission Issues

If you get "permission denied" errors:

```bash
# Solution 1: Use sudo (recommended)
sudo docker-compose up -d

# Solution 2: Fix docker socket permissions (temporary)
sudo chmod 666 /var/run/docker.sock

# Solution 3: Add user to docker group (permanent)
sudo usermod -aG docker $USER
# Then logout and login again

# Verify the fix
docker ps    # Should work without sudo after group change
```

## 📊 System Information

```bash
# Get NAS IP address
hostname -I
ip addr show

# Check available space
df -h

# Check memory usage
free -h

# Check running processes
ps aux | grep docker
```

## 🔒 Permissions

```bash
# Fix ownership (run as root/admin)
chown -R 1000:1000 /volume1/docker/your-app/

# Fix permissions
chmod -R 755 /volume1/docker/your-app/
chmod +x /volume1/docker/your-app/*.sh
```

## 🌐 Network

```bash
# Check open ports
netstat -tlnp | grep :3000
netstat -tlnp | grep :5000

# Check if service is responding
curl -f http://localhost:5000/api/health
```

## 🔄 Service Management

```bash
# Using docker-compose
docker-compose up -d        # Start services
docker-compose down         # Stop services  
docker-compose ps           # List containers
docker-compose logs -f      # View logs
docker-compose restart api  # Restart specific service

# Using Synology Docker GUI
# DSM → Docker → Container → Start/Stop/Restart
```

## 🚨 Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs container-name

# Check container status
docker-compose ps

# Restart container
docker-compose restart container-name
```

### Port conflicts
```bash
# Check what's using a port
netstat -tlnp | grep :PORT_NUMBER

# Kill process using port (if needed)
sudo kill -9 $(lsof -t -i:PORT_NUMBER)
```

### Permission issues
```bash
# Check file ownership
ls -la /volume1/docker/your-app/

# Fix permissions
sudo chown -R 1000:1000 /volume1/docker/your-app/
```

### Database issues
```bash
# Backup database
docker-compose exec api cp /app/app.db /app/backup.db

# Reset database (will lose data!)
docker-compose down
rm api/app.db
docker-compose up -d
```

## 📱 Access URLs

Once deployed, access your application at:
- Frontend: `http://YOUR_NAS_IP:3000`
- API: `http://YOUR_NAS_IP:5000`
- Health Check: `http://YOUR_NAS_IP:5000/api/health`
- Full App (nginx): `http://YOUR_NAS_IP` (if using full docker-compose.yml)

## 🔐 Security Tips

1. Change default JWT secret in `.env`
2. Use strong passwords for NAS admin account
3. Enable firewall in DSM (Control Panel → Security → Firewall)
4. Consider using HTTPS with reverse proxy
5. Keep DSM and Docker updated
