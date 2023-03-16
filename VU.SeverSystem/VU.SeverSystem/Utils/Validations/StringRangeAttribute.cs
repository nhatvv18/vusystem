using System.ComponentModel.DataAnnotations;

namespace VU.SeverSystem.Utils.Validations
{
    /// <summary>
    /// Cho phép một trong các giá trị, nếu là null thì bỏ qua
    /// </summary>
    public class StringRangeAttribute : ValidationAttribute
    {
        public string[] AllowableValues { get; set; }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (AllowableValues?.Contains(value?.ToString()) == true || value == null)
            {
                return ValidationResult.Success;
            }

            var msg = $"Vui lòng chọn 1 trong các giá trị sau: {string.Join(", ", AllowableValues ?? new string[] { "Không có giá trị nào được phép" })}.";
            if (!string.IsNullOrEmpty(ErrorMessage))
            {
                msg = ErrorMessage;
            }
            return new ValidationResult(msg);
        }
    }
}
