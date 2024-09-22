package member

import (
	"net/http"

	"example.com/sa-67-example/config"
	"example.com/sa-67-example/entity"
	"github.com/gin-gonic/gin"
)

func CreateMember(c *gin.Context) {
	var member entity.Member
    if err := c.ShouldBindJSON(&member); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

    var employee entity.Employee
    db.First(&employee, member.EmployeeID)
	if employee.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "employee not found"})
		return
	}
    var gender entity.Gender
	db.First(&gender,member.GenderID)
	if gender.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "gender not found"})
		return
	}
    var status entity.Status
	db.First(&status, member.StatusID)
	if status.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "status not found"})
		return
	}
	u := entity.Member{
		FristName: member.FristName,   
		LastName:  member.LastName,   
		Email:     member.Email,      
		PhoneNumber:  member.PhoneNumber,
		DateOfBirth:  member.DateOfBirth,
		StartDate:   member.StartDate,  
		EndDate:  member.EndDate,
		Points:    member.Points,
        StatusID:    member.StatusID,
        Status:    status,
        EmployeeID: member.EmployeeID,
        Employee: employee,
        GenderID: member.GenderID,
        Gender: gender,
	}

	// บันทึก
	if err := db.Create(&u).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": u})
}

// GetAll retrieves all promotion along with their associated class
func GetAll(c *gin.Context) {
    var member []entity.Member
    db := config.DB()
    results := db.Preload("Status").Preload("Gender").Preload("Employee").Find(&member)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }
    c.JSON(http.StatusOK, member)
}

// Get retrieves a single promotion by ID along with their associated class
func Get(c *gin.Context) {
    ID := c.Param("id")
    var member entity.Member
    db := config.DB()
    results := db.Preload("Status").Preload("Gender").Preload("Employee").First(&member, ID)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }
    if member.ID == 0 {
        c.JSON(http.StatusNoContent, gin.H{})
        return
    }
    c.JSON(http.StatusOK, member)
}

// Update updates the details of an existing menu
func Update(c *gin.Context) {
    var member entity.Member
    memberID := c.Param("id")
    db := config.DB()

    result := db.First(&member, memberID)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
        return
    }

    if err := c.ShouldBindJSON(&member); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
        return
    }

    result = db.Save(&member)
    if result.Error != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// Delete removes a menu by ID
// func Delete(c *gin.Context) {
//     id := c.Param("id")
//     db := config.DB()

//     if tx := db.Exec("DELETE FROM member WHERE id = ?", id); tx.RowsAffected == 0 {
//         c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
//         return
//     }
//     c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
// }
func Delete(c *gin.Context) {
    var member entity.Member
	memberID := c.Param("id")

	// ค้นหาข้อมูลโปรโมชั่น
	db := config.DB()
	db.First(&member, memberID)
	if member.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "promotion not found"})
		return
	}


	// ลบสมาชิก
	if err := db.Delete(&member).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Member deleted successfully"})
}
