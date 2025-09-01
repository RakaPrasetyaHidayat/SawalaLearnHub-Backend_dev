t{
  "status": "success",
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {
    // Additional error details
  }
}
```

## 🔒 Authentication

### JWT Token
Semua protected endpoints memerlukan JWT token di header:
```http
Authorization: Bearer your-jwt-token-here
```

### User Roles
- **ADMIN**: Full access ke semua endpoints
- **MENTOR**: Access ke task management dan user guidance
- **INTERN**: Basic access untuk learning dan submission

### User Status
- **PENDING**: User baru menunggu approval
- **APPROVED**: User aktif dengan full access
- **REJECTED**: User ditolak, access terbatas

## 🚨 Error Handling

### Common HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **408**: Request Timeout
- **500**: Internal Server Error

### CORS Errors
Jika mengalami CORS error, pastikan:
1. Backend sudah di-deploy dengan konfigurasi CORS terbaru
2. Frontend menggunakan URL backend yang benar
3. Request headers sudah sesuai
4. Credentials setting sudah benar (`credentials: 'include'` atau `withCredentials: true`)

## 📞 Support

Untuk bantuan teknis atau pertanyaan tentang API:
1. Check dokumentasi CORS di `CORS-GUIDE.md`
2. Lihat contoh implementasi di atas
3. Test endpoint dengan cURL atau Postman
4. Hubungi tim backend dengan detail error lengkap

## 📝 Changelog

### v1.0.0 (Latest)
- ✅ Comprehensive CORS configuration
- ✅ Multi-layer CORS protection
- ✅ Improved error handling
- ✅ Timeout middleware optimization
- ✅ Production-ready deployment
- ✅ Complete API documentation
