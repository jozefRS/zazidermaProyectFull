package utez.edu.mx.Zaziderma.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtTokenProvider {
    private final String SECRET_KEY = "YKsNOhXJdsKh7xGQvH5vHHLDtTV9WdatSd800mcnAYR+yQ7n4Xcnb8yFmBNOSFpmErq9NdfFkbcib4xph7qV9g==";
    private final long EXPIRATION_TIME = 864000000;

    public String generateToken(String email, String rol, String id) {
        return Jwts.builder()
                .setSubject(email)
                .claim("rol", rol) // 👈 Agregamos el rol
                .claim("idUsuario", id) // 👈 Aquí agregamos el ID del usuario
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }

    public String extractUserIdFromToken(String token) {
        Claims claims = extractClaims(token);
        return claims.get("idUsuario", String.class); // Ahora extraemos el "idUsuario"
    }

    // Método para extraer los Claims (información del token)
    private Claims extractClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token);
            return true;

        } catch (Exception e) {
            return false;
        }
    }

    public String getRolFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.get("rol", String.class);
    }

    public Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}

