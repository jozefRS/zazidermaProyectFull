package utez.edu.mx.Zaziderma.auth;

import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Base64;

public class JwsTokenGenerator {

    public  static void main(String[] args) {
        SecretKey key= Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS512);
        String encodedKey = Base64.getEncoder().encodeToString(key.getEncoded());
        System.out.println("llave generada" + encodedKey);
    }
}

